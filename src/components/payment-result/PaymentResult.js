import React, { Component } from 'react';
import PaymentStore from '../PaymentStore';

class PaymentResult extends Component {

  render() {
    const cardInfo = PaymentStore.store[PaymentStore.store.length - 1];
    
    const valueStyle = {
      color: '#838383',
    };
    
    return (
      <div class="result-container">
        <h1>Результат оплаты</h1>
        <div class="card-info">
          <p>
            Номер карты: 
            <span style={valueStyle}>{cardInfo.cardNumber}</span>
          </p>
          <p>
            Срок действия карты: 
            <span style={valueStyle}>{cardInfo.expiryMonth}/{cardInfo.expiryYear}</span>
          </p>
          <p>
          Статус заказа: 
            <span style={valueStyle}>Авторизован</span>
          </p>
        </div>
      </div>
    );
  }
}

export default PaymentResult;
