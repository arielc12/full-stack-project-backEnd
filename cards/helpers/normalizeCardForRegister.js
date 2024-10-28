const normalizeCardForRegister = async (card, userId) => {
    return {
        title: card.title,
        subtitle: card.subtitle || "",
        images: card.images,
        ingredients: card.ingredients,
        instructionsList: card.instructionsList,
        description: card.description || "",
        user_id: userId,
    };
};

module.exports = normalizeCardForRegister;