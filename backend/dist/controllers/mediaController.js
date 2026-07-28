import { MediaTheme } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/apiError.js';
export const getMediaByTheme = asyncHandler(async (req, res, next) => {
    const theme = req.params.theme;
    let media = await MediaTheme.findOne({ themeKey: theme });
    if (!media) {
        // Fallback to classic if theme not found
        media = await MediaTheme.findOne({ themeKey: 'classic' });
    }
    res.status(200).json({
        success: true,
        theme,
        media,
    });
});
export const getAllMedia = asyncHandler(async (req, res, next) => {
    const collectionsArray = await MediaTheme.find();
    const collections = {};
    collectionsArray.forEach((item) => {
        collections[item.themeKey] = item;
    });
    res.status(200).json({
        success: true,
        mediaCollections: collections,
    });
});
export const updateThemeMedia = asyncHandler(async (req, res, next) => {
    const theme = req.params.theme;
    const content = req.body;
    if (!content || typeof content !== 'object') {
        return next(new ApiError(400, 'Valid media content object is required.'));
    }
    const updatedMedia = await MediaTheme.findOneAndUpdate({ themeKey: theme }, { ...content, themeKey: theme }, { new: true, upsert: true });
    res.status(200).json({
        success: true,
        message: `Media content for theme '${theme}' updated.`,
        media: updatedMedia,
    });
});
