import React, {useEffect, useState} from "react";
import {IProduct} from "../../../interfaces/product";
import {Api} from "../../../api/api";
import {Col, Container} from "reactstrap";
import Preloader from "../../../ui/Preloader/Preloader";
import Row from "reactstrap/lib/Row";
import {ProductCard} from "../../../ui/ProductCard/ProductCard";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/redux-store";

export const Catalog = () => {
    const user = useSelector((state: RootState) => state.user);

    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user.selected_currency === null) return;
        (async() => {
            const response = await Api.getProducts({currency: user.selected_currency});
            setProducts(response.data);
            setLoading(false);
        })()
    }, [user.selected_currency]);


    return (
        <Container>
            {loading ? (
                <Preloader />
            ): (
                <Row>
                    {products.map(product => {
                        return (
                            <Col lg={3} className="mt-3">
                                <ProductCard product={product}/>
                            </Col>
                        )
                    })}
                </Row>
            )}
            
        </Container>
    )


};

