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
        type: "uploaded",
        limit: 10
    });

    const { data } = await requestData(options);
    const photos = data.map(({ images }) => ({
        picture: images[0].source
    }));
    
    res.status(200).send({
        data: photos,
    });

};

export {
    getMyProfile,
    getMyPosts,
    getMyPhotos
}