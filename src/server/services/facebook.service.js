import { GRAPH_URL, requestData } from "../utils/auth";

const fbOptions = (url, accessToken, fields)  => ({
    url: `${GRAPH_URL}/${url}`,
    method: "get",
    params: {
        access_token: accessToken,
        ...fields,
    }
});

const getMyProfile = async (req, res) => {
    const { accessToken } = req.session;
    const options = fbOptions("me", accessToken, {
        fields: "name,email"
    });
    const profile = await requestData(options);
    res.status(200).send(profile);
};

const getMyPosts = async (req, res) => {
    const { accessToken } = req.session;
    const options = fbOptions("me", accessToken, {
        fields: "posts{message,comments,attachments}"
    });
    const posts = await requestData(options);
    res.status(200).send(posts);
};

const getMyPhotos = async (req, res) => {
    const { accessToken } = req.session;
    const options = fbOptions("me/photos", accessToken, {
        fields: "comments,images",
        type: "uploaded"
    });
    const pictures = await requestData(options);
    const photos = pictures.data[0].images;
    res.status(200).send({
        data: photos.map(picture => ({
            picture: picture.source
        })),
    });
};

export {
    getMyProfile,
    getMyPosts,
    getMyPhotos
}