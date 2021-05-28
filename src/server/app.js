import express from "express";
import expressSession from "express-session";
import passport from "passport";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";

import { getMyProfile, getMyPosts, getMyPhotos } from "./services/facebook.service";
import { authFacebook, authFacebookCallback } from "./strategies/facebook.strategy";
import userRouter from "./routes/user.route";
import localAuthRouter from "./routes/local-auth.route";
import { authMiddleware } from "./middleware/auth.middleware";


const corsOptions = {
    origin: [process.env.CLIENT_URL],
    credentials: true,
}

const app = express();

app.set('trust proxy', 1);
const location = `${process.cwd()}/src/server/public`;
console.log(process.cwd());
app.use(express.static(location));

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: "jsshouts",
        cookie: {
            secure: true,
            sameSite: "none"
        },
        name: "jsshouts.session"
    })
);
app.use(cookieParser());

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname });
});

app.use("/local-auth", localAuthRouter);

app.get("/facebook", authFacebook);
app.get('/facebook/callback', authFacebookCallback);

app.get("/login", (req, res) => {
    console.log(req, res);
});

app.get("/home", (req, res) => {
    console.log(req.session);
    const { user } = req.session.passport;
    req.session.accessToken = user.accessToken;
    req.session.save();
    res.status(200).send(user);
});

app.get("/callback", (req, res) => {
    const { user } = req.session.passport;
    req.session.accessToken = user.accessToken;
    req.session.user = user;
    req.session.save();
    console.log(req);
    console.log(req.cookies);
    res.cookie("jsshouts.session", req.cookies["jsshouts.session"]);
    res.redirect("/")
});

app.get("/profile", authMiddleware, (req, res) => {
    const { user } = req;
    return res.status(200).send(user);
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect(process.env.CLIENT_URL)
});

app.use("/user", authMiddleware, userRouter);

app.get("/me", authMiddleware, getMyProfile);
app.get("/me/posts", authMiddleware, getMyPosts);
app.get("/me/photos", authMiddleware, getMyPhotos);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
});