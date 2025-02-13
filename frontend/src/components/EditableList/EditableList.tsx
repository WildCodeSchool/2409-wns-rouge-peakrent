import styles from "./EditableList.module.scss";
import Button from "../../UI/Button/Button";
import { GoPlus, GoCheck } from "react-icons/go";
import { CiEdit, CiTrash } from "react-icons/ci";
import { Category, Tag } from "../../types/types";
import { useState } from "react";

type Props = {
  title: string;
  newTitle: string;
  items?: Category[] | Tag[];
  handleItemEdit: (itemId: number, newName: string) => void;
  handleAddNewItem: (name: string) => void;
  handleDeleteItem: (itemId: number) => void;
};

const EditableList = ({
  title,
  newTitle,
  items,
  handleItemEdit,
  handleAddNewItem,
  handleDeleteItem,
}: Props) => {
  const [modifyItem, setModifyItem] = useState<number | null>(null);
  const [addItem, setAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [itemNewName, setItemNewName] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.caption}>
        <h2>{title} :</h2>
        {addItem && (
          <div className={styles.newItemContainer}>
            <p>{newTitle} :</p>
            <div className={styles.inputBox}>
              <input
                type="text"
                value={newItemName}
                onChange={(event) => setNewItemName(event.target.value)}
                className={styles.inputBody}
              />
              <Button
                children={<GoCheck size={30} />}
                onClick={(event) => {
                  event.preventDefault();
                  handleAddNewItem(newItemName);
                  setAddItem(false);
                }}
                design="TERTIARY"
              />
            </div>
          </div>
        )}
        <Button
          children={
            addItem ? (
              <GoPlus size={30} style={{ transform: "rotate(-45deg)" }} />
            ) : (
              <GoPlus size={30} />
            )
          }
          design="SECONDARY"
          onClick={
            addItem
              ? (event) => {
                  event.preventDefault();
                  setAddItem(false);
                }
              : (event) => {
                  event.preventDefault();
                  setAddItem(true);
                }
          }
        />
      </div>
      <div className={styles.categories}>
        {items?.map((item) => (
          <div key={item.id} className={styles.categorieContainer}>
            {modifyItem === item.id ? (
              <input
                type="text"
                value={itemNewName}
                onChange={(event) => setItemNewName(event.target.value)}
                className={styles.inputBody}
              />
            ) : (
              <p className={styles.categorieName}>{item.name}</p>
            )}
            <div className={styles.buttonsContainer}>
              {modifyItem === item.id && (
                <Button
                  children={<GoCheck size={30} />}
                  design="TERTIARY"
                  onClick={(event) => {
                    event.preventDefault();
                    handleItemEdit(item.id, itemNewName);
                  }}
                />
              )}

              <Button
                children={
                  modifyItem === item.id ? (
                    <CiTrash size={30} />
                  ) : (
                    <CiEdit size={30} />
                  )
                }
                design="SECONDARY"
                onClick={
                  modifyItem === item.id
                    ? (event) => {
                        event.preventDefault();
                        handleDeleteItem(item.id);
                        setModifyItem(null);
                      }
                    : (event) => {
                        event.preventDefault();
                        setModifyItem(item.id);
                      }
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditableList;
