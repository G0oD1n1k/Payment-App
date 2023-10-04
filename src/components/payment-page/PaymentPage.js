import React, { Component } from 'react';
import { makeObservable, observable } from 'mobx';
import PaymentStore from '../PaymentStore';
import { Navigate } from "react-router-dom";


class PaymentPage extends Component {
  
  state = {
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv2: '',
    error: new Map(),
    isPaymentSuccessful: false,
  };

  constructor() {
    super();
    makeObservable(this, {
        state: observable
      }
    );
  }

  isValidCardNumber = (cardNumber) => /^[0-9]{12,19}$/.test(cardNumber);

  isValidExpiryMonth = (expiryMonth) => /^(0[1-9]|1[0-2])$/.test(expiryMonth);

  isValidExpiryYear = (expiryYear) => /^[0-9]{2}$/.test(expiryYear);

  isValidExpiryCVV2 = (cvv2) => /^[0-9]{3}$/.test(cvv2);

  isValidExpiryDate = (expiryMonth, expiryYear) => {
    const currentDate = new Date(); 
    const currentYear = currentDate.getFullYear() % 100;

    const enteredMonth = parseInt(expiryMonth, 10);
    const enteredYear = parseInt(expiryYear, 10);

    return enteredYear < currentYear || (enteredYear === currentYear && enteredMonth < currentDate.getMonth() + 1);
  }

  getInputStyles = (field) => {
    const isError = this.state.error.get(field);
    return {
      outline: isError ? '1px solid red' : 'initial', // Устанавливаем красную границу, если есть ошибка
      color: isError ? 'red' : 'initial', // Устанавливаем красный цвет текста, если есть ошибка
    };
  };
  
  handlePayment = (e) => {
    e.preventDefault();

    const { cardNumber, expiryMonth, expiryYear, cvv2, error } = this.state;
    error.clear();

    if (!this.isValidCardNumber(cardNumber)) {
      error.set('cardNumber', 'Некорректный номер карты. Номер карты должен содержать от 12 до 19 цифр');
    }

    if (!this.isValidExpiryMonth(expiryMonth) || !this.isValidExpiryYear(expiryYear)) {
      error.set('expirationDate', 'Некорректные значения срока истечения действия карты');
    }

    if (this.isValidExpiryDate(expiryMonth, expiryYear)) {
      error.set('expirationDate', 'Срок истечения действия карты должен быть больше или равен текущему месяцу и году');
    }
    if (!this.isValidExpiryCVV2(cvv2)) {
      error.set('expirationCVV2', 'Некорректное значение cvv2');
    }
    
    if (error.size > 0) {
      this.setState({isPaymentSuccessful: false, error: error});
      return;
    }

    const cardInfo = {
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv2,
    }
    PaymentStore.addCard(cardInfo);
    
    this.setState({
      isPaymentSuccessful: true,
      errors: []
    });
  };


  render() {
    if (this.state.isPaymentSuccessful) { 
      <Navigate to="/payment-result" replace={true}/>
    }
    return (
      <div>
        <div class="form-container">
        <h1>Платёжное средство</h1>
        <form>
          <div class="input-container">
            <input type="text" id="cardNumber" data-mask="0000 0000 0000 0000"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) event.preventDefault();
              }}
              maxLength={19}
              value={this.state.cardNumber}
              onChange={(e) => this.setState({ cardNumber: e.target.value })}
              style={this.getInputStyles('cardNumber')}
            />
            <label htmlFor='cardNumber' class='placeholder'>Номер карты</label>
          </div>
          <div class="row">
            <div class="col">
              <div class="input-container">
                <input type="text" id="expirationMonth"
                  maxLength={2}
                  value={this.state.expiryMonth}
                  onChange={(e) => this.setState({ expiryMonth: e.target.value })}
                  style={this.getInputStyles('expirationDate')}
                />
                <label htmlFor="expirationMonth" class="placeholder">Месяц</label>
              </div>
            </div>
            <div class="col">
              <div class="input-container">
                <input type="text" id="expirationYear"
                  maxLength={2}
                  value={this.state.expiryYear}
                  onChange={(e) => this.setState({ expiryYear: e.target.value })}
                  style={this.getInputStyles('expirationDate')}
                />
                <label htmlFor="expirationYear" class="placeholder">Год</label>
              </div>
            </div>
            <div class="col">
              <div class="input-container">
                <input id="expirationCVV2" type="password" 
                  maxLength={3}
                  value={this.state.cvv2}
                  onChange={(e) => this.setState({ cvv2: e.target.value })}
                  style={this.getInputStyles('expirationCVV2')}
                />
                <label htmlFor="expirationCVV2"class="placeholder">CVV2/CVC2</label>
              </div>
            </div>
          </div>
          {this.state.error && (
            <div>
            {
              Array.from(this.state.error.entries()).map(([key, value]) => (
                <p key={key} class='error'>{value}</p>
              ))
            }
          </div>
          )}
          <button onClick={this.handlePayment}>Оплатить</button>
        </form>
        </div>
        { (this.state.isPaymentSuccessful) && (
          <Navigate to="/payment-result" replace={true}/>
        )}
      </div>
    );
  }
}

export default PaymentPage;
