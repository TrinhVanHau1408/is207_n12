import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import 'antd/dist/antd.min.css';
import { Checkbox, Col, Row , Button, Input} from 'antd';
import { MinusOutlined, PlusOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import styles from './Cart.module.scss';
import { AuthContext } from '~/Context/AuthProvider';
import { AppContext } from '~/Context/AppProvider';
import formatVND from '~/utilis';
import { useLocalStorage } from '~/hooks/useLocalStorage';
const cx = classNames.bind(styles);

const WarpperButtonStyled = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    
    Input {
        width: 15%;
        text-align: center;
    }
`
function totalMoney(cartIds, carts) {
    console.log(carts)
    const cartFitler =  carts.filter(cart => {
        if (cartIds.includes(cart.id) ) return cart;
    })

    console.log(cartFitler)
    const total = cartFitler.reduce((total, currCart) =>total + parseFloat(currCart.totalMoney)
    , 0) 
    console.log(total)
    return total;
}
function Cart() {
    const [savedLocalCheckout, setSavedLocalCheckout, clearLocalStorage] = useLocalStorage('checkout');
    const navigate = useNavigate();
    const {carts, cartId, setCartId, cartChange} = React.useContext(AppContext);
    const [checkedList, setCheckedList] = useState([]);
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    
    if (checkedList.length<1) {
       
        setCheckedList([cartChange])
    }
    console.log('length', checkedList.length);
    const onChange = (checkedValues) => {
        
        setCartId(checkedValues);
        setCheckedList(checkedValues);
        setTotalPrice(totalMoney(checkedValues, carts))
        setCheckAll(checkedValues.length === Object.keys(carts).length);
    };

    const onCheckAllChange = (e) => {

        function cartIds () {
            const ids = carts.map(cart => cart.id);
            return ids;
        }
        
        setCartId(e.target.checked?cartIds():[]);
        setCheckedList(e.target.checked?cartIds():0)
        setTotalPrice(e.target.checked ?totalMoney(cartIds(), carts):0);
        setIndeterminate(false);
        setCheckedList(e.target.checked ? cartIds() : []);
        setCheckAll(e.target.checked);
    };

    const handleCheckout = () => {
        console.log('Selected cartid', cartId)
        if (cartId.length > 0) {
            console.log("checkout oke");
            setSavedLocalCheckout(carts.filter(cart => (cartId.includes(cart.id))&&cart));
            navigate('/checkout')
        } else {
            console.log("Checkout not oke")
        }
    }
    console.log('list ID cart',checkedList)
    return (
        <div className={cx('cart')}>
            <h3 className={cx('header')}>Giỏ hàng của bạn</h3>
            <div className={cx('cart-list')}>
                <div className={cx('wrap')}>
                    <Row gutter={24} className={cx('check-all')}>
                        <Col lg={2} className={cx('tag')}>
                        <Checkbox  onChange={onCheckAllChange} checked={checkAll}></Checkbox>
                        </Col>

                        <Col lg={6} span={2} className={cx('tag')}>
                            Tên sản phẩm
                        </Col>
                        <Col lg={4} className={cx('tag')}>
                            Hình ảnh
                        </Col>
                        <Col lg={4} className={cx('tag')}>
                            Số lượng
                        </Col>
                        <Col lg={4} className={cx('tag')}>
                            Đơn giá
                        </Col>
                        <Col lg={4} className={cx('tag')}>
                            Thao tác
                        </Col>
                    </Row>
                    <Checkbox.Group style={{ width: '100%' }} value={checkedList} onChange={onChange}>
                        <div className={cx('check-wrap')}>
                            {carts&&carts.map(cart => (
                                <Row key={cart.id} gutter={24} className={cx('check-item')}>
                                <Col lg={2} className={cx('checked ')}>
                                    <Checkbox value={cart.id} ></Checkbox>
                                </Col>
                                <Col lg={6}>
                                    <h4 className={cx('product-name')}>{cart.phoneName}</h4>
                                </Col>
                                <Col lg={4}>
                                    <img
                                        src="data:image/jpeg;base64,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"
                                        alt="iphone13"
                                        className={cx('product-img')}
                                    ></img>
                                </Col>
                                <Col lg={4} className={cx('actions')}>
                                    <WarpperButtonStyled>
                                        <Button icon={<MinusOutlined></MinusOutlined>}></Button>
                                            <Input
                                                value={cart.quantity}
                                                size='small'
                                            />
                                        <Button icon={<PlusOutlined></PlusOutlined>}></Button>
                                    </WarpperButtonStyled>
                                   
                                </Col>
                                <Col lg={4}>
                                    <h4 className={cx('price')}>{formatVND(cart.priceSale)}</h4>
                                </Col>
                                <Col lg={4} className={cx('btn-controll')}>
                                    <Button className={cx('btn-edit')}>Sửa</Button>
                                    <Button danger className={cx('btn-delete')}>Xóa</Button>
                                </Col>
                            </Row> 
                            ))}
                        
                        </div>
                    </Checkbox.Group>
                </div>
            </div>
            <div className={cx('footer')}>
                <Link to={'/'} className={cx('back')}>
                    <LeftOutlined />
                    <LeftOutlined /> Tiếp tục mua hàng
                </Link>
                <div className={cx('total')}>
                    <h3> Tổng tiền: </h3>
                    <p className={cx('total-money')}> &nbsp;{formatVND(totalPrice)}</p>
                </div>
            </div>
            <div className={cx('btn-buy')}>
                {/* <Link preventScrollReset={true} to={'/checkout'} onClick={()=>{window.location.reload()}}> */}
                    <Button onClick={handleCheckout}>Mua hàng</Button>
                {/* </Link> */}
            </div>
        </div>
    );
}

export default Cart;
