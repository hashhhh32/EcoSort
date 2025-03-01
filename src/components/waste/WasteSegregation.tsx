
import React, { useState } from 'react';
import { Search, ArrowRight, Info } from 'lucide-react';
import AnimatedTransition from '../ui/AnimatedTransition';

const WasteSegregation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const wasteCategories = [
    {
      id: 'plastic',
      name: 'Plastic',
      color: 'bg-eco-plastic/20',
      borderColor: 'border-eco-plastic',
      icon: '🧴',
      examples: ['Bottles', 'Containers', 'Bags', 'Packaging'],
      tips: [
        'Rinse containers before recycling',
        'Remove caps and lids',
        'Check for recycling symbols',
        'Avoid single-use plastics'
      ]
    },
    {
      id: 'paper',
      name: 'Paper',
      color: 'bg-eco-paper/20',
      borderColor: 'border-eco-paper',
      icon: '📄',
      examples: ['Newspapers', 'Cardboard', 'Magazines', 'Envelopes'],
      tips: [
        'Keep paper dry and clean',
        'Flatten cardboard boxes',
        'Remove tape and staples',
        'Separate glossy paper'
      ]
    },
    {
      id: 'glass',
      name: 'Glass',
      color: 'bg-eco-glass/20',
      borderColor: 'border-eco-glass',
      icon: '🥛',
      examples: ['Bottles', 'Jars', 'Containers', 'Glassware'],
      tips: [
        'Rinse thoroughly',
        'Remove lids and caps',
        'Separate by color if required',
        'Do not mix with ceramics'
      ]
    },
    {
      id: 'metal',
      name: 'Metal',
      color: 'bg-eco-metal/20',
      borderColor: 'border-eco-metal',
      icon: '🥫',
      examples: ['Cans', 'Foil', 'Bottle caps', 'Metal lids'],
      tips: [
        'Rinse food cans',
        'Crush to save space',
        'Remove paper labels when possible',
        'Keep metals separate from other materials'
      ]
    },
    {
      id: 'organic',
      name: 'Organic',
      color: 'bg-eco-compost/20',
      borderColor: 'border-eco-compost',
      icon: '🍎',
      examples: ['Food scraps', 'Garden waste', 'Coffee grounds', 'Eggshells'],
      tips: [
        'Use for composting',
        'Keep separate from non-compostables',
        'Break down larger pieces',
        'Avoid meat and dairy in home composting'
      ]
    },
    {
      id: 'ewaste',
      name: 'E-Waste',
      color: 'bg-gray-200',
      borderColor: 'border-gray-300',
      icon: '📱',
      examples: ['Phones', 'Batteries', 'Computers', 'Cables'],
      tips: [
        'Never dispose with regular trash',
        'Use dedicated e-waste centers',
        'Remove batteries if possible',
        'Erase personal data before disposal'
      ]
    }
  ];
  
  const filteredCategories = wasteCategories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.examples.some(example => 
      example.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };
  
  return (
    <div className="pt-20 pb-20 md:pb-6 px-4 min-h-screen bg-eco-backdrop">
      <AnimatedTransition animation="slide-down">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Waste Segregation</h1>
          <p className="text-muted-foreground">Learn how to properly sort your waste</p>
        </div>
      </AnimatedTransition>
      
      <AnimatedTransition animation="fade-in" delay={100}>
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search waste type..."
            className="pl-10 w-full h-12 rounded-lg border border-input bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </AnimatedTransition>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {filteredCategories.map((category, index) => (
          <AnimatedTransition 
            key={category.id} 
            animation="scale-up" 
            delay={150 + index * 50}
          >
            <button
              onClick={() => handleCategoryClick(category.id)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                category.color
              } border ${
                selectedCategory === category.id 
                  ? category.borderColor
                  : 'border-transparent'
              } hover:shadow-md`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{category.icon}</span>
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.examples.slice(0, 3).join(', ')}...
                  </p>
                </div>
              </div>
            </button>
          </AnimatedTransition>
        ))}
      </div>
      
      {selectedCategory && (
        <AnimatedTransition animation="slide-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-border">
            {wasteCategories
              .filter(category => category.id === selectedCategory)
              .map(category => (
                <div key={category.id}>
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">{category.icon}</span>
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">EXAMPLES</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.examples.map((example, i) => (
                        <span 
                          key={i} 
                          className="bg-muted px-3 py-1 rounded-full text-sm"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      TIPS FOR PROPER DISPOSAL
                    </h3>
                    <ul className="space-y-2">
                      {category.tips.map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <ArrowRight className="w-4 h-4 mr-2 text-primary mt-1 shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </AnimatedTransition>
      )}
    </div>
  );
};

export default WasteSegregation;
