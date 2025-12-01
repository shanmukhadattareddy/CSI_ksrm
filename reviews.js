const Review = require("../models/review");
const Event = require("../models/event");

module.exports.createReview = async(req,res) => {
    let event = await Event.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    event.reviews.push(newReview);

    await newReview.save();
    await event.save();
    
    req.flash("success","review added successfully");
    res.redirect(`/Events/${req.params.id}`);
};

module.exports.destroy = async(req,res) => {
    let { id,reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Event.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","review deleted");
    res.redirect(`/Events/${id}`);
};