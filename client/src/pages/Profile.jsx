import React, { useState } from "react";
import { Form, Button, FloatingLabel, Row, Container } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_DATA } from "../utils/queries";
import { REMOVE_ART, ADD_COMMENT, UPDATE_USERNAME } from "../utils/mutations";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import OrderHistory from '../components/OrderHistory';

const Profile = () => {
  const { loading, error, data, refetch } = useQuery(GET_USER_DATA);

  const [removeArt] = useMutation(REMOVE_ART, {
    refetchQueries: [{ query: GET_USER_DATA }],
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_USER_DATA }],
  });

  const [updateUsername] = useMutation(UPDATE_USERNAME, {
    refetchQueries: [{ query: GET_USER_DATA }],
  });

  const [commentTexts, setCommentTexts] = useState({});
  const [activeTab, setActiveTab] = useState("favorites");
  const [newUsername, setNewUsername] = useState("");
  const [showUpdateField, setShowUpdateField] = useState(false);

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center py-8">Error: {error.message}</p>;

  const favorites = data.me.savedArt;
  const username = data.me.username;

  const handleRemoveArt = async (artId) => {
    try {
      await removeArt({
        variables: { artId },
      });
      refetch();
    } catch (error) {
      console.error("Error removing artwork:", error);
    }
  };

  const handleAddComment = async (artId) => {
    try {
      await addComment({
        variables: {
          artworkId: artId,
          text: commentTexts[artId],
        },
      });

      setCommentTexts((prevState) => ({
        ...prevState,
        [artId]: "",
      }));

      refetch();
    } catch (error) {
      console.error("Error adding comment:", error.message, error.networkError, error.graphQLErrors);
    }
  };

  const handleUpdateUsername = async () => {
    try {
      await updateUsername({
        variables: { newUsername },
      });
      refetch();
      setNewUsername("");
      setShowUpdateField(false);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const renderFavorites = () => (
    <>
      <Container id="your-favorites" className="flex justify-center flex-col mt-8">
        <h2 className="text-3xl font-bold text-center">Your Favorites</h2>
        <p className="text-lg mb-6 text-center p-6">
          Discover the masterpieces you've favorited! This section showcases the artworks you've loved the most. Enjoy a personalized collection of your favorite pieces, complete with artist details and your personal comments.
        </p>
      </Container>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
        {favorites.map((art) => (
          <li
            key={art.id}
            className="flex flex-col justify-between p-4 border border-gray-300 rounded-lg shadow-lg bg-white h-full"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="mb-2">
                {art.artist_titles && (
                  <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-md mr-2 mb-1">
                    {art.artist_titles}
                  </span>
                )}
              </div>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleRemoveArt(art.id)}
                className="text-red-500 cursor-pointer hover:text-red-600"
              />
            </div>
            <div>
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-96 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-center">
                {art.title}
              </h3>
              <p className="text-gray-600 mb-4 text-center">{art.description}</p>
              <div>
                {art.comments && art.comments.length > 0 && (
                  <ul className="mb-4">
                    {art.comments.map((comment) => (
                      <li key={comment.id} className="text-gray-600">
                        {comment.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Add your feeling or impression"
                value={commentTexts[art.id] || ""}
                onChange={(e) =>
                  setCommentTexts({
                    ...commentTexts,
                    [art.id]: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-4/5 mr-2"
              />
              <button
                onClick={() => handleAddComment(art.id)}
                className="comment-btn text-white px-4 py-2 rounded focus:outline-none"
              >
                Add
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="container mx-auto px-4 pt-44 pb-8 flex flex-col items-center">
      <p className="text-center py-4 mb-4 text-xl">Hello, {username}!</p>
      <h2 className="text-3xl font-bold mb-8 text-center">Your Profile</h2>

      <div className="mb-8">
        <button
          onClick={() => setActiveTab("favorites")}
          className={`mx-2 px-4 py-2 ${activeTab === "favorites" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} rounded-md`}
        >
          Favorites
        </button>
        <button
          onClick={() => setActiveTab("order-history")}
          className={`mx-2 px-4 py-2 ${activeTab === "order-history" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} rounded-md`}
        >
          Order History
        </button>
        <button
          onClick={() => setShowUpdateField(!showUpdateField)}
          className="mx-2 px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Update Username
        </button>
      </div>

      {showUpdateField && (
        <div className="mb-8 w-full max-w-md mx-auto">
          <h3 className="text-2xl font-semibold mb-4">Edit Username</h3>
          <div className="d-flex mb-3">
  <Form.Control
    type="text"
    placeholder="Type Here"
    value={newUsername}
    onChange={(e) => setNewUsername(e.target.value)}
    className="me-3" 
  />
  <Button
    variant="primary"
    onClick={handleUpdateUsername}
  >
    Edit 
  </Button>
</div>
        </div>
      )}

      {activeTab === "favorites" && renderFavorites()}
      {activeTab === "order-history" && <OrderHistory />}
    </div>
  );
};

export default Profile;