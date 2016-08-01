'use strict';

import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';

const screen = Dimensions.get('window');

const styles = StyleSheet.create({

  transparent: {
    backgroundColor: 'transparent'
  },

  absolute: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }

});

const Modal = React.createClass({

  propTypes: {
    visible: React.PropTypes.bool,
    animated: React.PropTypes.bool,
    onDismiss: React.PropTypes.func,
  },

  getDefaultProps: function () {
    return {
      visible: false,
      animated: true,
    };
  },

  getInitialState: function () {
    return {
      position: new Animated.Value(screen.height),
      backdropOpacity: new Animated.Value(0),
      visible: false,
      isAnimateClose: false,
      isAnimateOpen: false,
      height: 0,
      width: 0
    };
  },

  componentWillReceiveProps: function(props) {
    if (typeof props.visible == "undefined") return;
    if (props.visible)
      this.open();
    else
      this.close();
  },

  animateBackdropOpen: function() {
    // isAnimateBackdrop store the backdrop animated state.
    if (this.state.isAnimateBackdrop) {
      this._animBackdrop.stop();
      this.state.isAnimateBackdrop = false;
    }

    this.state.isAnimateBackdrop = true;
    this._animBackdrop = Animated.timing(
      this.state.backdropOpacity,
      {
        toValue: .5,
        duration: this.props.animated ? 200 : 0,
      }
    );
    this._animBackdrop.start(() => {
      this.state.isAnimateBackdrop = false;
    });
  },

  animateBackdropClose: function() {
    if (this.state.isAnimateBackdrop) {
      this._animBackdrop.stop();
      this.state.isAnimateBackdrop = false;
    }

    this.state.isAnimateBackdrop = true;
    this._animBackdrop = Animated.timing(
      this.state.backdropOpacity,
      {
        toValue: 0,
        duration: this.props.animated ? 200 : 0,
      }
    );
    this._animBackdrop.start(() => {
      this.state.isAnimateBackdrop = false;
    });
  },

  /*
   * Open animation for the modal, will move up
   */
  animateOpen: function() {
    if (this.state.isAnimateClose) {
      this.state.animClose.stop();
      this.state.isAnimateClose = false;
    }

    // Backdrop fadeIn
    this.animateBackdropOpen();

    this.state.positionDest = this.state.containerHeight - this.state.height;

    this.state.isAnimateOpen = true;

    this._animOpen = Animated.timing(
      this.state.position,
      {
        toValue: this.state.positionDest,
        duration: this.props.animated ? 200 : 0,
        easing: Easing.out(Easing.cubic)
      }
    );
    this._animOpen.start(() => {
      this.state.isAnimateOpen = false;
      this.state.visible = true;
    });
  },

  /*
   * Close animation for the modal, will move down
   */
  animateClose: function() {
    if (this.state.isAnimateOpen) {
      this._animOpen.stop();
      this.state.isAnimateOpen = false;
    }

    // Backdrop fadeout
    this.animateBackdropClose();

    this.state.isAnimateClose = true;
    this.state.animClose = Animated.timing(
      this.state.position,
      {
        toValue: this.state.containerHeight,
        duration: this.props.animated ? 200 : 0,
        easing: Easing.out(Easing.cubic)
      }
    );
    this.state.animClose.start(() => {
      if (this.props.onDismiss) this.props.onDismiss();
      this.setState({
        isAnimateClose: false,
        visible: false
      });
    });
  },

  /*
   * Event called when the modal view layout is calculated
   */
  onViewLayout: function(evt) {
    this.state.containerHeight = evt.nativeEvent.layout.height;
    this.state.containerWidth = evt.nativeEvent.layout.width;
    if (this.state.height && this._onViewLayoutCalculated) this._onViewLayoutCalculated();
  },
  onModalViewLayout: function(evt) {
    this.state.height = evt.nativeEvent.layout.height;
    this.state.width = evt.nativeEvent.layout.width;
    if (this.state.containerHeight && this._onViewLayoutCalculated) this._onViewLayoutCalculated();
  },
  /*
   * Render the backdrop element
   */
  renderBackdrop: function() {
    let backdrop  = [];
      backdrop = (
        <TouchableWithoutFeedback onPress={this.close}>
          <Animated.View style={[styles.absolute, {backgroundColor:'#000', opacity: this.state.backdropOpacity}]} />
        </TouchableWithoutFeedback>
      );

    return backdrop;
  },

  /*
   * Render the component
   */
  render: function() {
    const visible     = this.state.visible || this.state.isAnimateOpen || this.state.isAnimateClose;

    if (!visible) return (<View/>);

    const backdrop    = this.renderBackdrop();
    const offsetX     = (screen.width - this.state.width) / 2;
    return (
      <View style={[styles.transparent, styles.absolute]} onLayout={this.onViewLayout} pointerEvents={'box-none'}>
        {backdrop}
        <Animated.View
          onLayout={this.onModalViewLayout}
          style={[this.props.style, {transform: [{translateY: this.state.position}, {translateX: offsetX}]} ]}>
          {this.props.children}
        </Animated.View>
      </View>
    );
  },

  open: function() {
    if (!this.state.isAnimateOpen && (!this.state.visible || this.state.isAnimateClose)) {
      this._onViewLayoutCalculated = () => {
        this.setState({});
        this.animateOpen();
      };
      this.setState({isAnimateOpen : true});
    }
  },

  close: function() {
    if (this.state.visible) {
      this.animateClose();
    }
  }
});

module.exports = Modal;
