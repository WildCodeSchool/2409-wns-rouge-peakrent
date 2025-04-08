import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_PRODUCT_BY_ID } from "../../GraphQL/products";
import { GET_CATEGORIES } from "../../GraphQL/categories";
import { DELETE_AD } from "../../GraphQL/deleteAd";
import { GET_TAGS } from "../../GraphQL/tags";
import { UPDATE_AD } from "../../GraphQL/updateAd";
import Button from "../../UI/Button/Button";
import { Category, Tag } from "../../types/types";
import styles from "./AdEditForm.module.scss";

const AdEditForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const paramId = params.id;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [tagsIds, setTagsIds] = useState<number[]>([]);
  const [location, setLocation] = useState("");
  const [owner, setOwner] = useState("");
  const [picture, setPicture] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");

  const { data: adResult } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { param: paramId },
  });
  const { data: categoriesResult } = useQuery<{ getCategories: Category[] }>(
    GET_CATEGORIES
  );
  const { data: tagsResult } = useQuery<{ getTags: Tag[] }>(GET_TAGS);

  const categories = categoriesResult?.getCategories;
  const tags = tagsResult?.getTags;
  const ad = adResult?.getAdById;

  useEffect(() => {
    setTitle(ad.title);
    setAuthor(ad.author);
    setCategoryId(ad.category.id);
    setTagsIds(ad.tags.map((tag: Tag) => tag.id));
    setLocation(ad.location);
    setOwner(ad.owner);
    setPicture(ad.picture);
    setPrice(ad.price);
    setDescription(ad.description ?? "");
  }, [ad]);

  const [onUpdateAd] = useMutation(UPDATE_AD);
  const [onDeleteAd] = useMutation(DELETE_AD);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const result = await onUpdateAd({
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
          id: paramId,
        },
      });
      if (result.data.updateAd.id) {
        navigate(`/ads/${result.data.updateAd.id}`, { replace: true });
      }
      // need update or refetch to show the modification
    } catch (error) {
      console.error("Error updating ad:", error);
    }
  };

  const handleDelete = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const result = await onDeleteAd({
        variables: { id: Number(paramId) },
      });
      if (result.data.deleteAd.title) {
        navigate("/", {
          replace: true,
          state: { title: result.data.deleteAd.title },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={styles.formContainer}>
      <div className={styles.titleContainer}>
        <h1>Modification d'annonce</h1>
        <Button
          children={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          }
          design="SECONDARY"
          onClick={handleDelete}
        />
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
        <Button children="Modifier mon annonce" />
      </form>
    </section>
  );
};

export default AdEditForm;
