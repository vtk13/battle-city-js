import React from 'react';

export default {
    componentDidMount: function() {
        this.collectionListener = () => this.forceUpdate();
        this.props.items.on('add', this.collectionListener);
        this.props.items.on('change', this.collectionListener);
        this.props.items.on('remove', this.collectionListener);
    },
    componentWillUnmount: function() {
        this.props.items.off('add', this.collectionListener);
        this.props.items.off('change', this.collectionListener);
        this.props.items.off('remove', this.collectionListener);
    },
    render: function() {
        return <ul>{this.props.items.map(item => this.renderElement(item, this.props))}</ul>;
    }
};
