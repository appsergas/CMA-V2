import React, { Component } from 'react'
import {View} from 'react-native'

import ApiUtils from './api-utils'

// import ErrorPage from '../error'

export function parseMethodNames(methods) {
  switch (typeof methods) {
    case 'object':
      return Object.keys(methods).map(key => {
        const value = methods[key]
        switch (typeof value) {
          case 'object': {
            const { moduleName, url, type, onError } = value
            // if (!moduleName) {
            //     throw new Error(`Missing 'moduleName' key in object '${key}'`)
            // }
            if (!url) {
              throw new Error(`Missing 'url' key in object '${key}'`)
            }
            if (!type) {
              throw new Error(`Missing 'type' key in object '${key}'`)
            }
            if (onError && typeof onError !== 'function') {
              throw new Error(
                `onError must be a function for resource '${key}'`
              )
            }
            return Object.assign({ alias: key }, value)
          }
          default: {
            throw new Error('Invalid method data type')
          }
        }
      })
    default:
      throw new Error('Invalid method data type.')
  }
}

export default function withApiConnector(ChildComponent, options) {
  const methods = parseMethodNames(options.methods)
  class WithApiWrapper extends Component {
    constructor(props) {
      super(props)
      const dispatchToPropsStore = this.mapDispatchToProps(methods)
      this.state = {
        actionResultToPropsStore: {},
        isFetching: true,
        dispatchToPropsStore,
        moduleName: '',
        errorType: ''
      }

      this.initApiCall = this.initApiCall.bind(this)
      this.mapDispatchToProps = this.mapDispatchToProps.bind(this)
    }

    mapDispatchToProps(methods) {
      return methods.reduce((props, nameInfo) => {
        const { moduleName, alias, type, url, authenticate } = nameInfo
        props[alias] = (...params) => {
          return this.initApiCall(type, moduleName, url, authenticate, alias, ...params)
        }
        return props
      }, {})
    }

    initApiCall(type, moduleName, url, authenticate, resource, data, params) {
      switch (type) {
        case 'get':
          ApiUtils.get(moduleName, url, authenticate, data, params).then(content => {
            this.handleResponse(resource, content, moduleName)
          })
          break
        case 'post':
          ApiUtils.post(moduleName, url, authenticate, data, params).then(content => {
            this.handleResponse(resource, content, moduleName)
          })
          break
          case 'mediapost':
            ApiUtils.mediapost(moduleName, url, authenticate, data, params).then(content => {
              this.handleResponse(resource, content, moduleName)
            })
            break
        case 'put':
          ApiUtils.put(moduleName, url, authenticate, data, params).then(content => {
            this.handleResponse(resource, content, moduleName)
          })
          break
          case 'multipartPut':
            ApiUtils.multipartPut(moduleName, url, authenticate, data, params).then(content => {
              this.handleResponse(resource, content, moduleName)
            })
            break
        case 'delete':
          ApiUtils.delete(moduleName, url, authenticate, data, params).then(content => {
            this.handleResponse(resource, content, moduleName)
          })
          break
        default:
          null
      }
    }

    handleResponse(resource, content, moduleName) {
      const { actionResultToPropsStore } = this.state
      this.handleError(content, moduleName)
      actionResultToPropsStore[`${resource}Result`] = { content }
      this.setState({ actionResultToPropsStore, isFetching: false })
    }

    handleError(content, moduleName) {
      if (content.error && content.error.isError) {
        this.setState({ moduleName, errorType: 'MODULE_ERROR' })
      }
    }

    render() {
      const {
        actionResultToPropsStore,
        dispatchToPropsStore,
        isFetching,
        errorType,
        moduleName
      } = this.state

      const childProps = {
        ...actionResultToPropsStore,
        ...dispatchToPropsStore
      }

      if (errorType) {
        return <View>error</View>
      }

      return (
        <ChildComponent
          {...childProps}
          initApiCall={this.initApiCall}
          {...this.props}
          isFetching={isFetching}
        />
      )
    }
  }
  return WithApiWrapper
}
