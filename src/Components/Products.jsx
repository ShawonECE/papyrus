import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

const Products = () => {
    const [searchText, setSearchText] = useState('');
    const [searched, setSearched] = useState(false);
    const [perPage, setPerPage] = useState(10);
    const [sortValue, setSortValue] = useState('Sort By');
    const [sort, setSort] = useState('no');
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [count, setCount] = useState(0);
    const [pageArray, setPageArray] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get('http://localhost:3000/count')
        .then(data => setCount(parseInt(data.data.count)))
    }, []);

    useEffect(() => {
        if (sortValue === 'Date: Newest first') {
            setSort('new_date_first');
        } else if (sortValue === 'Date: Oldest first') {
            setSort('old_date_first');
        } else if (sortValue === 'Price: High to Low') {
            setSort('high_price_first');
        } else if (sortValue === 'Price: Low to High') {
            setSort('low_price_first');
        } else {
            setSort('no');
        }
    }, [sortValue]);

    useEffect(() => {
        const newNumberOfPages = Math.ceil(count / perPage);
        setNumberOfPages(newNumberOfPages);
        const array = [];
        for (let i = 1; i <= newNumberOfPages; i++) {
            array.push(i);
        }
        setPageArray(array);
    }, [perPage, count]);

    const { isPending, data, refetch } = useQuery({ queryKey: [`products-${searchText}-${perPage}-${(currentPage-1)*perPage}-${sort}`], queryFn: async() => {
        const data = await axios.get(`http://localhost:3000/products?name=${searchText}&limit=${perPage}&skip=${(currentPage-1)*perPage}&sort=${sort}`);
        return data.data;
    } });

    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        const searchWord = form.search.value;
        setSearchText(searchWord);
        refetch();
        setSearched(true);
        form.reset();
    };

    const handleSort = (e) => {
        setSortValue(e.target.value);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchText('');
        setSearched(false);
        setCurrentPage(1);
        // refetch();
    };

    const handlePerPage = (e) => {
        const value = e.target.value;
        setPerPage(value);
        setCurrentPage(1);
        // refetch();
    };

    const handleCurrentPage = (number) => {
        setCurrentPage(number);
    };

    if (isPending) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                <div className="skeleton h-48"></div>
                <div className="skeleton h-48"></div>
                <div className="skeleton h-48"></div>
            </div>
        )
    }

    return (
        <div className="mt-5">
            <div className="flex justify-center">
                <div className="join mt-3 mb-5">
                    <form onSubmit={handleSearch}>
                        <input className="input input-bordered join-item w-64 md:w-96" placeholder="Search products here" name="search" />
                        <button type="submit" className="btn join-item border-0 bg-[#395B64] text-[#E7F6F2]">Search</button>
                    </form>
                </div>
            </div>
            {
                searched &&
                <div className="flex justify-center mt-4 mb-4">
                    <button className="btn" onClick={handleClearSearch}><MdOutlineCancel className="text-lg" /> Clear Search</button>
                </div>
            }
            <div className="flex justify-center mt-5 mb-5">
                <select value={sortValue} onChange={handleSort} className="select max-w-xs bg-gray-100 dark:bg-gray-200 text-lg font-semibold">
                    <option disabled>Sort By</option>
                    <option>Date: Newest first</option>
                    <option>Date: Oldest first</option>
                    <option>Price: High to Low</option>
                    <option>Price: Low to High</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                { 
                    data.map(product => <ProductCard key={product._id} product={product}></ProductCard>) 
                }
            </div>
            <div className="flex justify-center mt-5 mb-5">
                <select value={perPage} onChange={handlePerPage} className="select max-w-xs bg-gray-100 dark:bg-gray-200 text-lg font-semibold">
                    <option>10</option>
                    <option>20</option>
                    <option>30</option>
                </select>
            </div>
            <div className="flex justify-center mb-10">
                <div className="join">
                    {
                        pageArray.map(number => <button key={number} className={`join-item btn ${currentPage == number ? 'btn-active' : ''}`} onClick={() => handleCurrentPage(number)}>{number}</button>)
                    }
                </div>
            </div>
        </div>
    );
};

export default Products;