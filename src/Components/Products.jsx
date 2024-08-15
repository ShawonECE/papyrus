import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

const Products = () => {
    const [searchText, setSearchText] = useState('');
    const [searched, setSearched] = useState(false);
    const { isPending, data, refetch } = useQuery({ queryKey: [`products-${searchText}`], queryFn: async() => {
        const data = await axios.get(`http://localhost:3000/products?name=${searchText}`);
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

    const handleClearSearch = () => {
        setSearchText('');
        setSearched(false);
        refetch();
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                { 
                    data.map(product => <ProductCard key={product._id} product={product}></ProductCard>) 
                }
            </div>
        </div>
    );
};

export default Products;