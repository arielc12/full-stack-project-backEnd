const normalizeCard = async (card, userId, existingCard) => {
    return {
        title: card.title || existingCard.title,
        subtitle: card.subtitle || existingCard.subtitle || "",
        images: card.images ? card.images.map(image => ({
            url: image.url || "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
            alt: image.alt || "recipe card image",
        })) : existingCard.images,
        likesList: existingCard.likesList,
        commentsList: existingCard.commentsList,
        ingredients: card.ingredients || existingCard.ingredients,
        instructionsList: card.instructionsList || existingCard.instructionsList,
        description: card.description || existingCard.description || "",
        ratings: existingCard.ratings,
        createdAt: existingCard.createdAt,
        user_id: existingCard.user_id ? existingCard.user_id.toString() : userId.toString(),
    };
};

module.exports = normalizeCard;