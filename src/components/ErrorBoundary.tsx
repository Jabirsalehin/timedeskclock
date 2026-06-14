import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  widgetType?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Widget error (${this.props.widgetType}):`, error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-red-400 text-xs font-medium">
              {this.props.widgetType} widget error
            </p>
            <p className="text-red-300/70 text-xs mt-1 truncate">
              {this.state.error?.message || 'Unknown error'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
