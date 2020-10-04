import React from "react";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import {ICartItem, removeItemFromCart, setItemQuantity} from "../../../redux/cart-reducer";
import {Grow, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {Lang} from "../../../utils/Lang";

interface ICartPageItem{
    item: ICartItem
}

export const CartItem = ({item} : ICartPageItem) => {
    const dispatch = useDispatch();

    const currencySymbol = Lang.currency[item.currency];

    return (
      <Row className={"px-0 mb-2 pb-2 d-flex align-items-center border-bottom"}>
          <Col lg={2} md={3} sm={3} xs={3}>
              <img className="mr-2 h-100 w-100" src={item.img_url || ''} alt={item.title}/>
          </Col>
          <Col lg={10} md={9} sm={9} xs={9} className="px-0">
              <Row>
                  <Col className="d-flex flex-column" lg={6} md={12} xs={12}>
                      <h5>{item.title}</h5>
                  </Col>
                  <Col lg={6} md={12} xs={12} className='pr-0'>
                      <Row className="d-flex align-items-center">
                          <Col lg={4} md={3} sm={3} xs={4}  className="d-flex flex-column pr-0">
                              <div className="number-input">
                                  <button onClick={() => {
                                          if (item.quantity === 1) return;
                                          dispatch(setItemQuantity(item, item.quantity - 1))
                                    }}
                                  >
                                  </button>
                                  <input
                                      className="quantity"
                                      min="1"
                                      name="quantity"
                                      value={item.quantity}
                                      type="number"
                                      onChange={(event) => dispatch(setItemQuantity(item, +event.target.value))}
                                  />
                                  <button className="plus"
                                          onClick={() => dispatch(setItemQuantity(item, item.quantity + 1))}
                                  >
                                  </button>
                              </div>

                              {item.quantity > 1 && (
                                  <Grow  in={item.quantity > 1}>
                                      <div>
                                          {item.price} $ per item
                                      </div>
                                  </Grow>
                              )}


                          </Col>
                          <Col lg={6} md={4} sm={4} xs={5}>
                              <h5>{item.subtotal} {currencySymbol}</h5>
                          </Col>

                          <Col lg={2} md={1} sm={1} xs={1} className="pl-0">
                              <IconButton className="mx-2" onClick={() => dispatch(removeItemFromCart(item.id))}>
                                  <Delete fontSize="small" />
                              </IconButton>
                          </Col>
                      </Row>
                  </Col>
              </Row>
          </Col>
      </Row>
  )
};