import React, { Fragment } from 'react';
import Modal from 'react-modal';
import { ModalProvider, ModalConsumer } from './ModalContext';
import ModalRoot from './ModalRoot';

const Modal1 = ({ onRequestClose, ...otherProps }) => (
  <Modal isOpen onRequestClose={onRequestClose} {...otherProps}>
    <button onClick={onRequestClose}>close</button>
    <div>I am a modal</div>
  </Modal>
);

const Modal2 = ({ onRequestClose, foo, ...otherProps }) => (
  <Modal isOpen onRequestClose={onRequestClose} {...otherProps}>
    <button onClick={onRequestClose}>close</button>
    <div>second modal {foo}</div>
  </Modal>
);

const ModalExample = () => (
  <ModalProvider>
    <ModalRoot />
    <ModalConsumer>
      {({ showModal }) => (
        <Fragment>
          <button onClick={() => showModal(Modal1)}>Open Modal</button>
          <button onClick={() => showModal(Modal2, { foo: 'bar' })}>
            Open Second Modal
          </button>
        </Fragment>
      )}
    </ModalConsumer>
  </ModalProvider>
);

export default ModalExample;
