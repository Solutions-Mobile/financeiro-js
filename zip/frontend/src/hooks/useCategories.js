// src/hooks/useCategories.js
import { useEffect, useState } from 'react';
import { getItems, saveItem, deleteItem } from '../utils/dbActions';


const COLLECTION = "categories";


export const useCategories = () => {
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);


const load = async () => {
setLoading(true);
const data = await getItems(COLLECTION);
setCategories(data);
setLoading(false);
};


const add = async (item) => {
await saveItem(COLLECTION, item);
await load();
};


const remove = async (id) => {
await deleteItem(COLLECTION, id);
await load();
};


useEffect(() => {
load();
}, []);


return { categories, loading, add, remove, reload: load };
};