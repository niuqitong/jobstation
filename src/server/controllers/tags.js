import Tag from "../models/tag.js";


export const createTags = async (req, res, next) => {
    const { tags } = req.body;
    console.log('middleware: createTags')
    console.log(tags);
    try {
        await Tag.createTags(tags);
        next();
    } catch (error) {

        return res.status(400).json({ message: error.message });
    }
}

export const getTags = async (req, res) => {
    try {
        const targetTags = await Tag.find();
        res.status(201).json(targetTags);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


// export const removeTag = async (req, res) => {
//     const { tag } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No tag with name: ${tag}`);
//     await Tag.findAndRemove(id);
//     res.json({ message: "Tag deleted successfully." });
// }
