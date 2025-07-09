import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types';
import apiService from '../services/api';

interface BookContextType {
  books: Book[];
  featuredBooks: Book[];
  bestSellers: Book[];
  newArrivals: Book[];
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateBook: (id: string, book: Partial<Book>) => Promise<boolean>;
  deleteBook: (id: string) => Promise<boolean>;
  refreshBooks: () => Promise<void>;
  isLoading: boolean;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load books from database on component mount
  useEffect(() => {
    loadBooksFromDatabase();
  }, []);

  const loadBooksFromDatabase = async () => {
    setIsLoading(true);
    try {
      console.log('📚 Loading books from database...');
      const response = await apiService.getBooks();
      if (response.success && response.data) {
        setBooks(response.data);
        console.log(`✅ Loaded ${response.data.length} books from database`);
      } else {
        console.error('Failed to load books:', response.error);
        // Set default books jika API gagal
        setBooks([]);
      }
    } catch (error) {
      console.error('Error loading books:', error);
      // Set default books jika terjadi error
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addBook = async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('➕ Adding new book to database...');
      
      // Create FormData for API call
      const formData = new FormData();
      Object.entries(bookData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await apiService.createBook(formData);
      
      if (response.success) {
        console.log('✅ Book added successfully to database');
        // Refresh books from database
        await loadBooksFromDatabase();
        
        // Trigger homepage refresh
        window.dispatchEvent(new CustomEvent('bookAdded'));
        
        return true;
      } else {
        console.error('Failed to add book:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Failed to add book:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBook = async (id: string, updatedBook: Partial<Book>): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log(`✏️ Updating book ${id} in database...`);
      
      // Create FormData for API call
      const formData = new FormData();
      Object.entries(updatedBook).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await apiService.updateBook(id, formData);
      
      if (response.success) {
        console.log('✅ Book updated successfully in database');
        // Refresh books from database
        await loadBooksFromDatabase();
        
        // Trigger homepage refresh
        window.dispatchEvent(new CustomEvent('bookUpdated'));
        
        return true;
      } else {
        console.error('Failed to update book:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Failed to update book:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBook = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log(`🗑️ Deleting book ${id} from database...`);
      
      const response = await apiService.deleteBook(id);
      
      if (response.success) {
        console.log('✅ Book deleted successfully from database');
        // Refresh books from database
        await loadBooksFromDatabase();
        
        // Trigger homepage refresh
        window.dispatchEvent(new CustomEvent('bookDeleted'));
        
        return true;
      } else {
        console.error('Failed to delete book:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBooks = async () => {
    await loadBooksFromDatabase();
  };

  // Computed values from database data
  const featuredBooks = books.filter(book => book.featured).slice(0, 4);
  const bestSellers = books.filter(book => book.rating >= 4.5).slice(0, 4);
  const newArrivals = books
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <BookContext.Provider value={{
      books,
      featuredBooks,
      bestSellers,
      newArrivals,
      addBook,
      updateBook,
      deleteBook,
      refreshBooks,
      isLoading
    }}>
      {children}
    </BookContext.Provider>
  );
};