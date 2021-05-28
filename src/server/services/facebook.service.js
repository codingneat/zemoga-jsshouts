import { GRAPH_URL, requestData } from "../utils/auth";

const fbOptions = (url, accessToken, fields)  => ({
    url: `${GRAPH_URL}/${url}`,
    method: "get",
    params: {
        access_token: accessToken,
        fields,
    }
});

const getMyProfile = async (req, res) => {
    const { accessToken } = req.session;
    const options = fbOptions("me", accessToken, "name,email");
    const profile = await requestData(options);
    res.status(200).send(profile);
};

const getMyPosts = async (req, res) => {
    const { accessToken } = req.session;
    const options = fbOptions("me/photos", accessToken, "posts{message,comments,attachments}");
    const posts = await requestData(options);
    res.status(200).send(posts);
};

//me/photos?fields=images&type=uploaded
const getMyPhotos = async (req, res) => {
    const { accessToken } = req.session;
    const options = fbOptions("me", accessToken, "comments,images&type=uploaded");
    const { data } = await requestData(options);
    res.status(200).send({
        photos: data,
    });
};

export {
    getMyProfile,
    getMyPosts,
    getMyPhotos
}