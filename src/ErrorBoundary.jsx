import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding:40, fontFamily:'monospace', color:'#ff6b6b', background:'#0a0a0a', minHeight:'100vh' }}>
          <h2 style={{ marginBottom:16 }}>Runtime Error</h2>
          <pre style={{ whiteSpace:'pre-wrap', fontSize:'0.8rem' }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
