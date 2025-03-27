
export interface Order {
  _id: string;

  userId: string;

  items: Array<any>;
  shippingAddress: any;
  paymentMethod: string;
  paymentId: string;
  status: string;
  total: number;

  stateList: Array<any>;

  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentResponse {
  approvalUrl: string;
  orderId: string;
}
