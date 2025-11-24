// src/hooks/useWallets.js
import { useEffect, useState } from 'react';
import { getItems, saveItem, deleteItem } from '../utils/dbActions';


const COLLECTION = "wallets";


export const useWallets = () => {
const [wallets, setWallets] = useState([]);
const [loading, setLoading] = useState(true);


const load = async () => {
setLoading(true);
const data = await getItems(COLLECTION);
setWallets(data);
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


return { wallets, loading, add, remove, reload: load };
};