const Event = require("../models/event");

module.exports.index = async (req,res) => {
    let allEvents = await Event.find();
    for(i=0;i<allEvents.length;++i){
        for(j=i+1;j<allEvents.length;++j){
            a=allEvents[i].date.trim().split("-");
            b=allEvents[j].date.trim().split("-");
            aa=a[2].concat(a[1],a[0])
            bb=b[2].concat(b[1],b[0])
            if(aa<bb){
                t=allEvents[i];
                allEvents[i]=allEvents[j];
                allEvents[j]=t;
            }
        }
    }
    res.render("events/index.ejs", { allEvents });
};

module.exports.renderNewForm = (req,res) => {
    res.render("events/new.ejs");
};

module.exports.showEvent = async(req,res) => {
    let { id } = req.params;
    let event = await Event.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        } 
    });
    if(!event){
        req.flash("error","event you requred doest not exit");
        res.redirect("/events");
    }
    res.render("events/show.ejs", {event});
};

module.exports.createEvent =  async(req,res) => {
    let files=req.files;

    let newEvent = req.body.Event;
    let winners = newEvent.winners.split(",").filter(s=>s.length>0);
    let rules = newEvent.rules.split("\r\n").filter(s=>s.length>0);
    let coordinators = newEvent.coordinators.split(",").filter(s=>s.length>0);
    newEvent.winners=winners;
    newEvent.rules=rules;
    newEvent.coordinators=coordinators;
    newEvent.photos=[];

    for(let i=0;i<files.length;++i){
        let obj = {
            filename:files[i].filename,
            url:files[i].path,
        }
        newEvent.photos.push(obj);
    }

    let event = new Event(newEvent);
    await event.save();

    req.flash("success","New Event added");
    res.redirect("/Events");
};

module.exports.renderEditForm = async(req,res) => {
    let { id } = req.params;
    let event = await Event.findById(id);
    if(!event){
        req.flash("error","event you requred doest not exit");
        res.redirect("/events");
    }
    let winners = event.winners.join(',');
    let rules = event.rules.join("\r\n");
    let coordinators = event.coordinators.join(",");
    let photos = event.photos
    event.winners=winners;
    event.rules=rules;
    event.coordinators=coordinators;

    photos = photos.map((o) => {
        u=o.url;
        u=u.replace("/upload","/upload/h_250,w_200,e_blur:100");
        return(u);
    })

    res.render("events/edit.ejs",{ event,photos });
};

module.exports.updateEvent =  async(req,res ) => {
    let { id } = req.params;
    let event = req.body.Event;
    let winners = event.winners.split(",").filter(s=>s.length>0);
    let rules = event.rules.split("\r\n").filter(s=>s.length>0);
    let coordinators = event.coordinators.split(",").filter(s=>s.length>0);
    event.winners=winners;
    event.rules=rules;
    event.coordinators=coordinators;
    let updateEvent = await Event.findByIdAndUpdate(id,{...event});

    console.log(req.files);
    if(req.files.length>0){
        console.log("in req.files");
        updateEvent.photos = [];
        let files = req.files;
        for(let i=0;i<files.length;++i){
            let obj = {
                filename:files[i].filename,
                url:files[i].path,
            }
            updateEvent.photos.push(obj);
        }
        console.log(updateEvent);
        await updateEvent.save();    
    }

    req.flash("success","event details updated successfully");
    res.redirect(`/Events/${id}`);
};

module.exports.destroy =  async(req,res) => {
    let { id } = req.params;
    await Event.findByIdAndDelete(id);
    req.flash("success","event deleted");
    res.redirect("/Events");
};