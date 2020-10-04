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
    const settings = useSelector((state: RootState) => state.settings);

    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (settings.currency_status === 'idle') return;

        (async() => {
            const response = await Api.getProducts({currency: settings.currency});
            setProducts(response.data);
            setLoading(false);
        })()
    }, [settings.currency_status, settings.currency]);


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

