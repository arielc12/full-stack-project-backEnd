const { getCards, createCard } = require("../cards/models/cardsAccessDataService");
const { getUsers, registerUser } = require("../users/models/usersAccessDataService");

const initialData = require("../initialData/initialData.json");
const { getComments, createComment } = require("../comments/models/commentAccessDataService");

const initializeDatabase = async () => {
    try {
        const existingUsers = await getUsers();
        const existingCards = await getCards();
        const existingComments = await getComments();

        if (existingUsers.length < 3) {
            const usersToAddCount = 3 - existingUsers.length;
            const usersToAdd = initialData.users.filter(user =>
                !existingUsers.some(existingUser => existingUser.email === user.email)
            ).slice(0, usersToAddCount);
            for (const userData of usersToAdd) {
                const registeredUser = await registerUser(userData);
                console.log(`Created user: ${registeredUser.email}`);
            }
        }

        const updatedUsers = await getUsers();

        if (existingCards.length < 3) {
            const cardsToCreateCount = 3 - existingCards.length;
            const cardsToCreate = initialData.cards.filter(card =>
                !existingCards.some(existingCard => existingCard.title === card.title)
            ).slice(0, cardsToCreateCount);

            for (const cardData of cardsToCreate) {
                const randomIndex = Math.floor(Math.random() * updatedUsers.length);
                const randomUser = updatedUsers[randomIndex];
                cardData.user_id = randomUser._id;
                const card = await createCard(cardData);
                if (card instanceof Error) {
                    console.error(`Failed to create card for user ${randomUser.email}: ${card.message}`);
                } else {
                    console.log(`Created card: ${card.title} for user ${randomUser.email}`);
                }
            }
        }

        if (existingComments.length < 3) {
            const commentsToAddCount = 3 - existingComments.length;
            const commentsToAdd = initialData.comments.filter(comment =>
                !existingComments.some(existingComment => existingComment.body === comment.body)
            ).slice(0, commentsToAddCount);
            const existingCards = await getCards();
            if (existingCards.length === 0) {
                console.error('No cards available to assign comments to.');
                return;
            }
            for (const commentData of commentsToAdd) {
                const randomIndex = Math.floor(Math.random() * updatedUsers.length);
                const randomUser = updatedUsers[randomIndex];
                if (!commentData.body || !randomUser) {
                    console.error('Invalid comment data or user for creating a comment.');
                    continue;
                }
                commentData.userId = randomUser._id;
                const cardRandomIndex = Math.floor(Math.random() * existingCards.length);
                const cardId = existingCards[cardRandomIndex]._id;
                const comment = await createComment(commentData, cardId);
                if (comment instanceof Error) {
                    console.error(`Failed to create comment for user ${randomUser.email}: ${comment.message}`);
                } else {
                    console.log(`Created comment: "${comment.body}" for user ${randomUser.email}`);
                }
            }
        }
    } catch (error) {
        console.error('Error initializing the database: ' + error.message);
    }
};

module.exports = { initializeDatabase };
