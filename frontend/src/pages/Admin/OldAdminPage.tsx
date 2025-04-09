import { useMutation, useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../../GraphQL/categories";
import { CREATE_CATEGORY } from "../../GraphQL/createCategory";
import { CREATE_TAG } from "../../GraphQL/createTag";
import { DELETE_CATEGORY } from "../../GraphQL/deleteCategory";
import { DELETE_TAG } from "../../GraphQL/deleteTag";
import { GET_TAGS } from "../../GraphQL/tags";
import { UPDATE_CATEGORY } from "../../GraphQL/updateCategory";
import { UPDATE_TAG } from "../../GraphQL/updateTag";
import EditableList from "../../components/EditableList/EditableList";
import Loading from "../../components/Loading/Loading";
import { Category, Tag } from "../../types/types";
import styles from "./AdminPage.module.scss";

const AdminPage = () => {
  const {
    data: categoryResult,
    loading: categoryLoading,
    error: categoryError,
  } = useQuery<{ getCategories: Category[] }>(GET_CATEGORIES);
  const {
    data: tagResult,
    loading: tagLoading,
    error: tagError,
  } = useQuery<{ getTags: Tag[] }>(GET_TAGS);
  const categories = categoryResult?.getCategories;
  const tags = tagResult?.getTags;

  const [onCategoryCreation] = useMutation(CREATE_CATEGORY);
  const [onTagCreation] = useMutation(CREATE_TAG);
  const [onCategoryUpdate] = useMutation(UPDATE_CATEGORY);
  const [onTagUpdate] = useMutation(UPDATE_TAG);
  const [onTagDelete] = useMutation(DELETE_TAG);
  const [onCategoryDelete] = useMutation(DELETE_CATEGORY);

  const handleSubmitNewCategory = async (categoryName: string) => {
    try {
      const result = await onCategoryCreation({
        variables: { data: { name: categoryName } },
      });
      console.log(result);
    } catch (error) {
      console.error("Error on category creation:", error);
    }
  };
  const handleSubmitNewTag = async (tagName: string) => {
    try {
      const result = await onTagCreation({
        variables: { data: { name: tagName } },
      });
      console.log(result);
    } catch (error) {
      console.error("Error on tag creation :", error);
    }
  };
  const handleCategoryEdit = async (categoryId: number, newName: string) => {
    try {
      const result = await onCategoryUpdate({
        variables: { data: { name: newName }, id: categoryId },
      });
      console.log(result);
    } catch (error) {
      console.error("Error on tag creation :", error);
    }
  };
  const handleTagEdit = async (tagId: number, newName: string) => {
    try {
      const result = await onTagUpdate({
        variables: { data: { name: newName }, id: tagId },
      });
      console.log(result);
    } catch (error) {
      console.error("Error on tag creation :", error);
    }
  };
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const result = await onCategoryDelete({
        variables: { id: categoryId },
      });
      console.log(result);
    } catch (error) {
      console.error("Error on category deletion :", error);
    }
  };
  const handleDeleteTag = async (tagId: number) => {
    try {
      const result = await onTagDelete({
        variables: { id: tagId },
      });
      console.log(result);
    } catch (error) {
      console.error("Error on tag deletion :", error);
    }
  };

  if (categoryLoading || tagLoading) return <Loading />;
  if (categoryError || tagError) return <p>Error loading data</p>;
  return (
    <section className={styles.formContainer}>
      <form className={styles.form}>
        <EditableList
          title="Catégories"
          newTitle="Ajouter une catégorie"
          items={categories}
          handleItemEdit={handleCategoryEdit}
          handleAddNewItem={handleSubmitNewCategory}
          handleDeleteItem={handleDeleteCategory}
        />
        <EditableList
          title="Tags"
          newTitle="Ajouter un tag"
          items={tags}
          handleItemEdit={handleTagEdit}
          handleAddNewItem={handleSubmitNewTag}
          handleDeleteItem={handleDeleteTag}
        />
      </form>
    </section>
  );
};

export default AdminPage;
