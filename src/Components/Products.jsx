import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "./ProductCard";

const Products = () => {
    const { isPending, data } = useQuery({ queryKey: ['products'], queryFn: async() => {
        const data = await axios.get('http://localhost:3000/products');
        return data.data;
    } });

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                { 
                    data.map(product => <ProductCard key={product._id} product={product}></ProductCard>) 
                }
            </div>
        </div>
    );
};

export default Products;