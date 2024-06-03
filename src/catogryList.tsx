import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firestore from './firebaseCofig';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLang } from './langContext';

interface Category {
  id: string;
  krd_name: string;
  ar_name: string;
  eng_name: string;
  uidv1: string;
  date_now: string;
  image: string;
}

interface Item {
  id: string;
  name: string;
  categoryId: string;
  krd_name: string;
  ar_name: string;
  eng_name: string;
  price: string;
  date: string;
  uniqueId: string;
  image: string;
}

const CategoryList: React.FC = () => {
  const date = new Date();
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  const { currentLang } = useLang();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id' | 'image'>>({
    krd_name: '',
    ar_name: '',
    eng_name: '',
    uidv1: `id-${Math.random().toString(36).substr(2, 16)}`,
    date_now: formattedDate,
  });
  const [newItem, setNewItem] = useState<Omit<Item, 'id' | 'categoryId'>>({
    name: '',
    krd_name: '',
    ar_name: '',
    eng_name: '',
    price: '',
    date: formattedDate,
    uniqueId: `item-${Math.random().toString(36).substr(2, 16)}`,
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCategoriesAndItems = async () => {
      try {
        const categoryCollection = collection(firestore, 'catgory');
        const querySnapshot = await getDocs(categoryCollection);
        const fetchedCategories: Category[] = [];
        querySnapshot.forEach((doc) => {
          fetchedCategories.push({
            id: doc.id,
            ...doc.data(),
          } as Category);
        });
        setCategories(fetchedCategories);
  
        // If categories exist, set the first category as selected and fetch its items
        if (fetchedCategories.length > 0) {
          const firstCategoryId = fetchedCategories[0].id;
          setSelectedCategoryId(firstCategoryId);
          fetchItems(firstCategoryId);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategoriesAndItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoryCollection = collection(firestore, 'catgory');
      const querySnapshot = await getDocs(categoryCollection);
      const fetchedCategories: Category[] = [];
      querySnapshot.forEach((doc) => {
        fetchedCategories.push({
          id: doc.id,
          ...doc.data(),
        } as Category);
      });
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchItems = async (categoryId: string) => {
    try {
      const itemsCollection = collection(firestore, 'items');
      const q = query(itemsCollection, where('categoryId', '==', categoryId));
      const querySnapshot = await getDocs(q);
      const fetchedItems: Item[] = [];
      querySnapshot.forEach((doc) => {
        fetchedItems.push({
          id: doc.id,
          ...doc.data(),
        } as Item);
      });
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    fetchItems(categoryId);
  };

  const handleAddCategory = async () => {
    if (!user) {
      console.log('User is not authenticated. Please log in to add a category.');
      return;
    }
    try {
      let imageUrl = '';
      const storage = getStorage();
      if (imageFile) {
        const uniqueFilename = `${Date.now()}_${imageFile.name}_${Math.random().toString(36).substring(7)}`;
        const storageRef = ref(storage, `category_images/${uniqueFilename}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(firestore, 'catgory'), {
        ...newCategory,
        image: imageUrl,
      });

      console.log('Category added successfully');
      setNewCategory({
        krd_name: '',
        ar_name: '',
        eng_name: '',
        uidv1: `id-${Math.random().toString(36).substr(2, 16)}`,
        date_now: formattedDate,
      });
      setImageFile(null);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  const handleAddItem = async () => {
    if (!selectedCategoryId || !user) {
      console.log('No category selected or user is not authenticated.');
      return;
    }
    try {
      let imageUrl = '';
      const storage = getStorage();
      if (itemImageFile) {
        const uniqueFilename = `${Date.now()}_${itemImageFile.name}_${Math.random().toString(36).substring(7)}`;
        const storageRef = ref(storage, `item_images/${uniqueFilename}`);
        await uploadBytes(storageRef, itemImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(firestore, 'items'), {
        ...newItem,
        categoryId: selectedCategoryId,
        image: imageUrl,
      });

      console.log('Item added successfully');
      setNewItem({
        name: '',
        krd_name: '',
        ar_name: '',
        eng_name: '',
        price: '',
        date: formattedDate,
        uniqueId: `item-${Math.random().toString(36).substr(2, 16)}`,
        image: '',
      });
      setItemImageFile(null);
      fetchItems(selectedCategoryId);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleItemImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setItemImageFile(files[0]);
    }
  };

  return (
    <div>
      <div className="category-container" style={{direction: currentLang=="eng"?'ltr':'rtl',}}>
        {categories.map((category) => (
          <div key={category.id} onClick={() => handleCategoryClick(category.id)}>
            <div className="p-1">
              <Button>{currentLang === "krd" ? category.krd_name : currentLang === "ar" ? category.ar_name : category.eng_name}</Button>
              </div>
            </div>
          ))}
          {user &&
            <div className='add-category-button'>
              <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent className='DialogMarg'>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      <div>
                        <Input
                          type="text"
                          value={newCategory.krd_name}
                          onChange={(e) => setNewCategory({ ...newCategory, krd_name: e.target.value })}
                          placeholder="Enter Kurdish name"
                        />
                        <br />
                        <Input
                          type="text"
                          value={newCategory.ar_name}
                          onChange={(e) => setNewCategory({ ...newCategory, ar_name: e.target.value })}
                          placeholder="Enter Arabic name"
                        />
                        <br />
                        <Input
                          type="text"
                          value={newCategory.eng_name}
                          onChange={(e) => setNewCategory({ ...newCategory, eng_name: e.target.value })}
                          placeholder="Enter English name"
                        />
                        <br />
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                      <br />
                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose asChild>
                    <Button type="button" onClick={handleAddCategory}>
                      Add Category
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          }
        </div>
        <div className='Line-item2'></div>
        {selectedCategoryId &&  (

          <div className='items-container'>          
          {user && (
            <Dialog>
            <DialogTrigger className='item-adder'>ADD ITEM TO CATGORY</DialogTrigger>
            <DialogContent className='DialogMarg'>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                <div className='add-item-form'>

          <br />
          <Input
            type="text"
            value={newItem.krd_name}
            onChange={(e) => setNewItem({ ...newItem, krd_name: e.target.value })}
            placeholder="Enter Kurdish name"
          />
          <br />
          <Input
            type="text"
            value={newItem.ar_name}
            onChange={(e) => setNewItem({ ...newItem, ar_name: e.target.value })}
            placeholder="Enter Arabic name"
          />
          <br />
          <Input
            type="text"
            value={newItem.eng_name}
            onChange={(e) => setNewItem({ ...newItem, eng_name: e.target.value })}
            placeholder="Enter English name"
          />
          <br />
          <Input
            type="text"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            placeholder="Enter price"
          />
          <br />
          <Input
            type="file"
            accept="image/*"
            onChange={handleItemImageChange}
          />
          <br />
          </div>

                </DialogDescription>
              </DialogHeader>
              <DialogClose asChild>
                <Button type="button" onClick={handleAddItem}>
                Add Item
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
          )}
            

            
            
            



            <div className='each-item-list' style={{direction: currentLang=="eng"?'ltr':'rtl',}}>
            {items.map((item) => (
              <div className='each-item' key={item.id}>
                <div className='image-item'>
                  <img className='image-item-only' src={item.image} alt="" />
                </div>
                <div className='Line-item'></div>
                <div className='name-price'>
                  <p>{currentLang == "krd" ? item.krd_name : currentLang =="ar" ? item.eng_name : item.eng_name}</p>
                  <p>{item.price} IQD</p>
                </div>
              </div>
            ))}
            </div>


          </div>
        )}
      </div>
    );
  };
  
export default CategoryList;
  