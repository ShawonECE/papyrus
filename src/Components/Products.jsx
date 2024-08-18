import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";

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
    const [modalOpen, setModalOpen] = useState(false);
    const [filter, setFilter] = useState({
        category: 'all',
        brand: 'all',
        min_price: 'no',
        max_price: 'no'
    });

    useEffect(() => {
        axios.get('https://papyrus-server-rosy.vercel.app/count')
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

    const { isPending, data, refetch } = useQuery({ queryKey: [`products-${searchText}-${perPage}-${(currentPage-1)*perPage}-${sort}-${filter.min_price}-${filter.max_price}-${filter.brand}-${filter.category}`], queryFn: async() => {
        const data = await axios.get(`https://papyrus-server-rosy.vercel.app/products?name=${searchText}&limit=${perPage}&skip=${(currentPage-1)*perPage}&sort=${sort}&min_price=${filter.min_price}&max_price=${filter.max_price}&brand=${filter.brand}&category=${filter.category}`);
        return data.data;
    } });

    const {
        register,
        handleSubmit,
    } = useForm();

    const handleFilter = (data) => {
        setModalOpen(false);
        setCurrentPage(1);
        const newData = {};
        newData.category = data.category.toLowerCase();
        if (data.brand === 'All') {
            newData.brand = data.brand.toLowerCase();
        } else {
            newData.brand = data.brand;
        }
        if (data.min_price) {
            newData.min_price = data.min_price;
        } else {
            newData.min_price = 'no';
        }

        if (data.max_price) {
            newData.max_price = data.max_price;
        } else {
            newData.max_price = 'no';
        }
        setFilter(newData);
        refetch();
    };

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
            <div className="flex justify-center mt-5 mb-5 gap-5">
                <select value={sortValue} onChange={handleSort} className="select max-w-xs bg-gray-100 dark:bg-gray-200 text-lg font-semibold">
                    <option disabled>Sort By</option>
                    <option>Date: Newest first</option>
                    <option>Date: Oldest first</option>
                    <option>Price: High to Low</option>
                    <option>Price: Low to High</option>
                </select>
                <button className="btn" onClick={() => setModalOpen(true)}>Filter</button>
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

            {/* filtering modal */}
            <input type="checkbox" checked={modalOpen} id="my_modal_6" className="modal-toggle" readOnly />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <form method="dialog">
                        <button onClick={() => setModalOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <form className="card-body" onSubmit={handleSubmit(handleFilter)} noValidate>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select className="select bg-gray-100" {...register("category")}>
                                <option>All</option>
                                <option>Paper Products</option>
                                <option>Art Supplies</option>
                                <option>Writing Instruments</option>
                                <option>Filing and Organizing</option>
                                <option>Desk Accessories</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Brand</span>
                            </label>
                            <select className="select bg-gray-100" {...register("brand")}>
                                <option>All</option>
                                <option>Montex</option>
                                <option>Camel</option>
                                <option>Delli</option>
                                <option>Faber-Castell</option>
                                <option>Papier</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Min. Price</span>
                            </label>
                            <input type="number" className="input input-bordered" {...register("min_price")} />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Max. Price</span>
                            </label>
                            <input type="number" className="input input-bordered" {...register("max_price")} />
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn">Filter</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Products;