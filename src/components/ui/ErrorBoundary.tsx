import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent } from './Card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center space-y-4">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-heading-lg font-semibold text-[var(--color-text-primary)]">
                Quelque chose s'est mal passé
              </h2>
              <pre className="text-left p-4 bg-[var(--color-bg-tertiary)] rounded-lg text-body-xs text-red-500 overflow-auto max-h-64">
                {this.state.error?.message}
                {this.state.error?.stack}
              </pre>
              <Button variant="primary" onClick={this.handleRetry}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
    return this.props.children
  }
}