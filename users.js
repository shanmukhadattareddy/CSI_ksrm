const User = require("../models/user");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.singup = async(req,res) => {
    try{
        let { username,email,password } = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err) => {
            if(err){
                return next(err);
            }
            else{
                req.flash("success","user registered success");
                res.redirect("/Events");
            }
        });
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = async(req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async(req,res) => {
    req.flash("success","welcome back to CSI_KSRM");
    redirectUrl = res.locals.redirectUrl || "/home";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next) => {
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","you have logged out");
            res.redirect("/home");
        }
    });
}