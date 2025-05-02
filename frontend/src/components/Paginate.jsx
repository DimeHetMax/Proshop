import { Pagination } from "react-bootstrap";
// import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

const Paginate = ({
    pages,
    page,
    isAdmin = false,
    query = "",
    keyword = "",
    brand = "",
    category = "",
    minPrice,
    maxPrice }) => {

    const createLink = (x) => {
        if (isAdmin) {
            return `/admin/${query}/${x + 1}`
        } else {
            let params = new URLSearchParams();
            if (keyword) params.append("keyword", keyword);
            if (brand) params.append("brand", brand);
            if (category) params.append("category", category);
            if (minPrice) params.append("minPrice", minPrice);
            if (maxPrice) params.append("maxPrice", maxPrice);
            params.append("page", x + 1);

            return `/?${params.toString()}`;
        }
    }
    return (
        pages > 1 && (
            <Pagination className="custom-pagination">
                {[...Array(pages).keys()].map((x) => (
                    <Pagination.Item
                        key={x + 1}
                        active={x + 1 === Number(page)}
                        as={Link}
                        to={createLink(x)}
                    >
                        {x + 1}

                    </Pagination.Item>
                ))}
            </Pagination>
        )
    )
}

export default Paginate


// const Paginate = ({ pages, page, isAdmin = false, query, keyword = "" }) => {

//     return (
//         pages > 1 && (
//             <Pagination>
//                 {[...Array(pages).keys()].map((x) => (
//                     <LinkContainer
//                         key={x + 1}
//                         to={
//                             !isAdmin
//                                 ? keyword
//                                     ? `/search/${keyword}/page/${x + 1}`
//                                     : `/page/${x + 1}`
//                                 : `/admin/${query}/${x + 1}`

//                         }
//                     >
//                         <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
//                     </LinkContainer>
//                 ))}
//             </Pagination>
//         )
//     )
// }