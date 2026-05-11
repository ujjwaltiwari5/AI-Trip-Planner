// ===== ITINERARY FORM LOGIC =====
class ItineraryPlanner {
    constructor() {
        this.form = document.getElementById('itineraryForm');
        this.plannerSection = document.getElementById('planner');
        this.resultsSection = document.getElementById('resultsSection');
        this.init();
    }
    
    init() {
        if (!this.form) {
            console.log('⚠️ Form not found');
            return;
        }
        
        // Form events
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Date logic
        this.setupDatePickers();
        
        // Preferences tags
        this.setupTags();
        
        // Auto-fill from plan buttons
        this.setupAutoFill();
        
        console.log('✅ Itinerary form initialized');
    }
    
    setupDatePickers() {
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        
        if (startDate && endDate) {
            // Default dates (next week)
            const today = new Date();
            today.setDate(today.getDate() + 7);
            startDate.valueAsDate = today;
            
            const end = new Date(today);
            end.setDate(end.getDate() + 4);
            endDate.valueAsDate = end;
            
            // Min date = today
            startDate.min = new Date().toISOString().split('T')[0];
            
            startDate.addEventListener('change', function() {
                const start = new Date(this.value);
                const end = new Date(start);
                end.setDate(end.getDate() + 4);
                endDate.min = this.value;
                endDate.valueAsDate = end;
            });
        }
    }
    
    setupTags() {
        const input = document.getElementById('preferencesInput');
        const tagsContainer = document.getElementById('preferenceTags');
        
        if (!input || !tagsContainer) return;
        
        input.addEventListener('keypress', function(e) {
            if (e.key === ',' || e.key === 'Enter') {
                e.preventDefault();
                const tag = this.value.trim();
                if (tag && tag.length > 1) {
                    this.addTag(tag, tagsContainer);
                    this.value = '';
                }
            }
        });
        
        input.addEventListener('blur', function() {
            const tag = this.value.trim();
            if (tag && tag.length > 1) {
                this.addTag(tag, tagsContainer);
                this.value = '';
            }
        });
    }
    
    addTag(text, container) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.dataset.value = text.toLowerCase();
        tag.innerHTML = `
            ${text}
            <span class="remove" onclick="itineraryPlanner.removeTag(this)">×</span>
        `;
        container.appendChild(tag);
    }
    
    removeTag(element) {
        element.parentElement.remove();
    }
    
    setupAutoFill() {
        // Listen for plan button data
        window.planTrip = (destination, budget = 30000, days = 5) => {
            document.getElementById('destination').value = destination;
            document.getElementById('budget').value = budget;
            
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 7);
            document.getElementById('startDate').valueAsDate = startDate;
            
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + days - 1);
            document.getElementById('endDate').valueAsDate = endDate;
            
            // Scroll to form
            this.plannerSection.scrollIntoView({ behavior: 'smooth' });
        };
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const generateBtn = this.form.querySelector('.btn-generate');
        const originalText = generateBtn.innerHTML;
        
        // Loading state
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI Planning...';
        generateBtn.disabled = true;
        
        try {
            // Form data
            const formData = {
                destination: document.getElementById('destination').value,
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value,
                budget: parseInt(document.getElementById('budget').value),
                travelers: {
                    count: parseInt(document.getElementById('travelerCount').value),
                    type: document.getElementById('travelerType').value
                },
                preferences: Array.from(document.querySelectorAll('#preferenceTags .tag'))
                    .map(tag => tag.dataset.value)
            };
            
            console.log('📋 Form submitted:', formData);
            
            // Simulate AI generation (Backend ready होने पर replace करेंगे)
            await this.simulateAI(formData);
            
        } catch (error) {
            console.error('❌ Error:', error);
            alert('Something went wrong! Please try again.');
        } finally {
            // Reset button
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
        }
    }
    
    async simulateAI(data) {
        // Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate sample itinerary
        const itinerary = this.generateSampleItinerary(data);
        
        // Show results
        this.showResults(itinerary);
    }
    
    generateSampleItinerary(data) {
        const days = Math.ceil(
            (new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24)
        ) + 1;
        
        return {
            title: `Perfect ${data.destination} Trip`,
            destination: data.destination,
            days: days,
            totalBudget: data.budget,
            dailyBudget: Math.floor(data.budget / days),
            itinerary: [
                {
                    day: 1,
                    activities: [
                        {
                            time: "09:00",
                            activity: "Arrival & Check-in",
                            location: `${data.destination} Airport/Hotel`,
                            description: "Welcome to your dream vacation!"
                        },
                        {
                            time: "14:00",
                            activity: "Iconic Sightseeing",
                            location: "Famous Landmark",
                            description: "Explore the heart of the city"
                        }
                    ]
                },
                {
                    day: 2,
                    activities: [
                        {
                            time: "08:00",
                            activity: "Adventure Day",
                            location: "Local Adventure Spot",
                            description: "Thrilling experiences await!"
                        }
                    ]
                }
                // More days...
            ],
            tips: [
                "Book popular spots early",
                "Try local street food",
                "Carry cash for small shops"
            ]
        };
    }
    
    showResults(itinerary) {
        const resultsHTML = `
            <div class="results-header">
                <h2>${itinerary.title}</h2>
                <button id="newItinerary" class="btn-secondary">
                    <i class="fas fa-plus"></i> New Trip
                </button>
            </div>
            
            <div class="itinerary-summary">
                <div class="summary-grid">
                    <div class="summary-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${itinerary.destination}</span>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-calendar"></i>
                        <span>${itinerary.days} Days</span>
                    </div>
                    <div class="summary-item highlight">
                        <i class="fas fa-rupee-sign"></i>
                        <span>₹${itinerary.totalBudget.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="itinerary-days">
                ${itinerary.itinerary.map(day => `
                    <div class="day-card">
                        <h3>Day ${day.day} - ₹${itinerary.dailyBudget.toLocaleString()}</h3>
                        ${day.activities.map(activity => `
                            <div class="activity">
                                <div class="activity-time">${activity.time}</div>
                                <div class="activity-details">
                                    <h4>${activity.activity}</h4>
                                    <p>${activity.location}</p>
                                    <small>${activity.description}</small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
            
            <div class="travel-tips">
                <h3>✨ Pro Tips</h3>
                <ul>
                    ${itinerary.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            
            <div class="action-buttons">
                <button class="btn-primary download-btn">
                    <i class="fas fa-download"></i> Download PDF
                </button>
                <button class="btn-secondary share-btn">
                    <i class="fas fa-share"></i> Share Itinerary
                </button>
            </div>
        `;
        
        document.getElementById('itineraryContent').innerHTML = resultsHTML;
        
        // Show results section
        this.plannerSection.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // New itinerary button
        document.getElementById('newItinerary').addEventListener('click', () => {
            this.plannerSection.classList.remove('hidden');
            this.resultsSection.classList.add('hidden');
            this.form.reset();
            document.getElementById('preferenceTags').innerHTML = '';
        });
    }
}

// Global access
const itineraryPlanner = new ItineraryPlanner();

// Global function for plan buttons
window.planTrip = function(destination, budget = 30000, days = 5) {
    itineraryPlanner.setupAutoFill();
    document.getElementById('destination').value = destination;
    document.getElementById('budget').value = budget;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7);
    document.getElementById('startDate').valueAsDate = startDate;
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days - 1);
    document.getElementById('endDate').valueAsDate = endDate;
    
    document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
};