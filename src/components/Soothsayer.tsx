import { useState } from 'react'

interface Prediction {
  category: string
  title: string
  impact: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  description: string
  emoji: string
}

function Soothsayer() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [isExpanded, setIsExpanded] = useState(false)

  // Predictive analysis data
  const predictions: Prediction[] = [
    // Society Trends
    {
      category: 'society',
      title: 'Digital Nomad Movement Accelerating',
      impact: 'bullish',
      confidence: 78,
      description: 'Remote work adoption continues to drive crypto adoption for cross-border payments and decentralized work platforms.',
      emoji: '🌍'
    },
    {
      category: 'society',
      title: 'Gen Z Financial Behavior Shift',
      impact: 'bullish',
      confidence: 72,
      description: 'Younger generations showing increased interest in alternative investments and cryptocurrency over traditional markets.',
      emoji: '👥'
    },
    // Culture
    {
      category: 'culture',
      title: 'NFT Integration in Mainstream Media',
      impact: 'neutral',
      confidence: 65,
      description: 'Major entertainment franchises exploring blockchain technology, creating volatile but interesting opportunities.',
      emoji: '🎨'
    },
    {
      category: 'culture',
      title: 'Crypto Gaming Boom',
      impact: 'bullish',
      confidence: 81,
      description: 'Play-to-earn models gaining traction in developing markets, driving demand for gaming tokens and SOL ecosystem.',
      emoji: '🎮'
    },
    // Hot Issues
    {
      category: 'issues',
      title: 'Regulatory Clarity Improving',
      impact: 'bullish',
      confidence: 68,
      description: 'Several jurisdictions moving towards clear crypto regulations, reducing uncertainty in the market.',
      emoji: '⚖️'
    },
    {
      category: 'issues',
      title: 'Institutional Adoption Increasing',
      impact: 'bullish',
      confidence: 85,
      description: 'Major financial institutions launching crypto services and ETF approvals driving mainstream legitimacy.',
      emoji: '🏦'
    },
    {
      category: 'issues',
      title: 'DeFi Security Focus',
      impact: 'neutral',
      confidence: 70,
      description: 'Increased focus on smart contract audits and security may slow innovation but improve trust.',
      emoji: '🔒'
    },
    // Sporting Events
    {
      category: 'sports',
      title: 'FIFA World Cup Fan Token Surge',
      impact: 'bullish',
      confidence: 75,
      description: 'Major sporting events historically correlate with increased crypto trading activity and fan token engagement.',
      emoji: '⚽'
    },
    {
      category: 'sports',
      title: 'Athlete Crypto Endorsements Rising',
      impact: 'bullish',
      confidence: 73,
      description: 'Top athletes partnering with crypto platforms, bringing mainstream attention and new user adoption.',
      emoji: '🏆'
    },
    {
      category: 'sports',
      title: 'Sports Betting on Blockchain',
      impact: 'bullish',
      confidence: 79,
      description: 'Decentralized sports betting platforms gaining traction, particularly in markets with limited traditional options.',
      emoji: '🎲'
    }
  ]

  // Filter predictions based on active category
  const filteredPredictions = activeCategory === 'all' 
    ? predictions 
    : predictions.filter(p => p.category === activeCategory)

  // Get impact badge color
  const getImpactBadgeClass = (impact: string) => {
    switch(impact) {
      case 'bullish': return 'badge-success'
      case 'bearish': return 'badge-error'
      case 'neutral': return 'badge-warning'
      default: return 'badge-ghost'
    }
  }

  // Category labels
  const categories = [
    { id: 'all', label: '🔮 All Insights', count: predictions.length },
    { id: 'society', label: '🌍 Society', count: predictions.filter(p => p.category === 'society').length },
    { id: 'culture', label: '🎨 Culture', count: predictions.filter(p => p.category === 'culture').length },
    { id: 'issues', label: '📰 Hot Issues', count: predictions.filter(p => p.category === 'issues').length },
    { id: 'sports', label: '⚽ Sports', count: predictions.filter(p => p.category === 'sports').length },
  ]

  return (
    <div className="card bg-gradient-to-br from-purple-900 to-indigo-900 shadow-xl border-2 border-purple-500">
      <div className="card-body">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title text-3xl mb-2 text-purple-200">
              🔮 Soothsayer Says...
            </h2>
            <p className="text-purple-300 text-sm">
              Predictive analysis on society, culture, hot issues & sporting events
            </p>
          </div>
          <button 
            className="btn btn-circle btn-ghost text-purple-200"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="mt-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`btn btn-sm ${activeCategory === cat.id ? 'btn-primary' : 'btn-ghost'} text-white`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            {/* Predictions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPredictions.map((prediction, idx) => (
                <div 
                  key={idx}
                  className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{prediction.emoji}</span>
                        <h3 className="font-bold text-sm">{prediction.title}</h3>
                      </div>
                      <div className={`badge ${getImpactBadgeClass(prediction.impact)} badge-sm`}>
                        {prediction.impact.toUpperCase()}
                      </div>
                    </div>
                    
                    <p className="text-xs text-base-content/70 mb-3">
                      {prediction.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">Confidence:</span>
                        <div className="w-24">
                          <progress 
                            className="progress progress-primary w-full" 
                            value={prediction.confidence} 
                            max="100"
                          ></progress>
                        </div>
                        <span className="text-xs font-mono">{prediction.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="alert alert-warning mt-6 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>
                <strong>Disclaimer:</strong> These predictions are for informational purposes only and should not be considered financial advice. 
                Always conduct your own research before making trading decisions. The Soothsayer's crystal ball may be cloudy sometimes! 🔮✨
              </span>
            </div>
          </div>
        )}

        {/* Collapsed View Summary */}
        {!isExpanded && (
          <div className="mt-4">
            <div className="flex items-center gap-4 text-purple-200">
              <div className="stat bg-purple-800/30 rounded-lg p-3">
                <div className="stat-value text-2xl text-success">
                  {predictions.filter(p => p.impact === 'bullish').length}
                </div>
                <div className="stat-title text-xs text-purple-300">Bullish Signals</div>
              </div>
              <div className="stat bg-purple-800/30 rounded-lg p-3">
                <div className="stat-value text-2xl text-warning">
                  {predictions.filter(p => p.impact === 'neutral').length}
                </div>
                <div className="stat-title text-xs text-purple-300">Neutral Trends</div>
              </div>
              <div className="stat bg-purple-800/30 rounded-lg p-3">
                <div className="stat-value text-2xl text-error">
                  {predictions.filter(p => p.impact === 'bearish').length}
                </div>
                <div className="stat-title text-xs text-purple-300">Bearish Signals</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Soothsayer
