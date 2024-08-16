import moment from 'moment';
import PropTypes from 'prop-types';
import { FaRegStar } from "react-icons/fa";

const ProductCard = ({product}) => {
    const { product_name, brand, img_url, description, price, category, rating, adding_date } = product;
    return (
        <div className="card bg-base-100 shadow-xl">
            <figure>
                <img
                    src={ img_url }
                    alt={ product_name } />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    { product_name }
                    <div className="badge badge-outline">{ brand }</div>
                </h2>
                <p>{ description }</p>
                <p className='font-semibold'>Price: ${ price }</p>
                <p className='font-semibold'>Adding Date: { moment(adding_date).format("DD-MM-YYYY") }</p>
                <p></p>
                <div className="card-actions justify-end">
                    <div className="badge badge-outline">{ category }</div>
                    <div className="badge badge-outline gap-1"><FaRegStar />{ rating }</div>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.object.isRequired,
};

export default ProductCard;