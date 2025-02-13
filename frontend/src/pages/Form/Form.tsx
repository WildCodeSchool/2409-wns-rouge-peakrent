import { useState } from "react";
import Button from "../../UI/Button/Button";
import { Category, Tag } from "../../types/types";
import styles from "./Form.module.scss";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../../GraphQL/categories";
import { GET_TAGS } from "../../GraphQL/tags";
import { CREATE_AD } from "../../GraphQL/createAd";

const Form = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState<number>();
  const [tagsIds, setTagsIds] = useState<number[]>([]);
  const [location, setLocation] = useState("");
  const [owner, setOwner] = useState("");
  const [picture, setPicture] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");

  const [onCreateAd] = useMutation(CREATE_AD);

  const { data: categoryResult } = useQuery<{ getCategories: Category[] }>(
    GET_CATEGORIES
  );
  const { data: tagResult } = useQuery<{ getTags: Tag[] }>(GET_TAGS);
  const categories = categoryResult?.getCategories;
  const tags = tagResult?.getTags;

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const result = await onCreateAd({
        variables: {
          data: {
            title,
            author,
            category: { id: categoryId },
            location,
            owner,
            picture,
            price,
            description,
            tags: tagsIds.map((id) => ({ id })),
          },
        },
      });
      console.log(result);
      if (result.data.createAd.id) {
        navigate(`/ads/${result.data.createAd.id}`, { replace: true });
      }
      // need update or refetch to show the modification
    } catch (error) {
      console.error("Error updating ad:", error);
    }
  };

  return (
    <section className={styles.formContainer}>
      <div className={styles.titleContainer}>
        <h1>Ajout d'annonce</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Informations sur le livre :</h2>
        <div className={styles.bookInfo}>
          <div className={styles.inputContainer}>
            <label className={styles.inputCaption}>Titre:</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={styles.inputBody}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputCaption}>Auteur:</label>
            <input
              type="text"
              name="author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className={styles.inputBody}
            />
          </div>
        </div>
        <div className={styles.bookInfo}>
          <div className={styles.inputContainer}>
            <label className={styles.inputCaption}>Image (url):</label>
            <input
              type="text"
              name="imageUrl"
              value={picture}
              onChange={(event) => setPicture(event.target.value)}
              className={styles.inputBody}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputCaption}>
              Prix: <span>(en centimes)</span>
            </label>
            <input
              type="number"
              name="price"
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
              className={styles.inputBody}
            />
          </div>
        </div>
        <div className={styles.bookInfo}>
          <div className={styles.inputContainer}>
            <label className={styles.inputCaption}>Categorie :</label>
            <select
              name="selectedCategory"
              defaultValue=""
              value={categoryId}
              onChange={(event) => setCategoryId(Number(event.target.value))}
              className={styles.inputBody}
            >
              <option value="" disabled={true}>
                -- Choissisez une categorie --
              </option>
              {categories?.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.tagsContainer}>
          <p className={styles.checkboxesCaption}>Tags :</p>
          <div className={styles.checkboxesContainer}>
            {tags?.map((tag) => (
              <label key={tag.id}>
                <input
                  type="checkbox"
                  checked={tagsIds.includes(tag.id) === true}
                  onChange={() => {
                    if (tagsIds.includes(tag.id)) {
                      setTagsIds(tagsIds.filter((id) => tag.id !== id));
                    } else {
                      setTagsIds([...tagsIds, tag.id]);
                    }
                  }}
                />
                <span></span>
                {tag.name}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.inputCaption}>Description:</label>
          <textarea
            cols={40}
            rows={7}
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={styles.inputBody}
          />
        </div>
        <h2>Informations sur le vendeur :</h2>
        <div className={styles.ownerInfo}>
          <div className={styles.inputContainer}>
            <label className={styles.inputCaption}>Votre email:</label>
            <input
              type="email"
              name="vendeur"
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              className={styles.inputBody}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputCaption}>Localisation:</label>
            <input
              type="text"
              name="localisation"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className={styles.inputBody}
            />
          </div>
        </div>
        <Button children="Ajouter mon annonce" />
      </form>
    </section>
  );
};

export default Form;
