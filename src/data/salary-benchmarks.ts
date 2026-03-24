interface SalaryBenchmark {
  median_band: string;
  sample_size: number;
}

// Seed data: industry:city:yoe → median salary band
// Will be expanded with real data over time
export const SALARY_BENCHMARKS: Record<string, SalaryBenchmark> = {
  "IT:Bengaluru:2": { median_band: "30-50K", sample_size: 1200 },
  "IT:Bengaluru:3": { median_band: "50-75K", sample_size: 1400 },
  "IT:Bengaluru:5": { median_band: "75K-1.2L", sample_size: 1800 },
  "IT:Bengaluru:7": { median_band: "1.2-2L", sample_size: 1100 },
  "IT:Bengaluru:10": { median_band: "1.2-2L", sample_size: 800 },
  "IT:Bengaluru:15": { median_band: "2L+", sample_size: 400 },

  "IT:Mumbai:2": { median_band: "30-50K", sample_size: 900 },
  "IT:Mumbai:3": { median_band: "50-75K", sample_size: 1000 },
  "IT:Mumbai:5": { median_band: "75K-1.2L", sample_size: 1200 },
  "IT:Mumbai:7": { median_band: "1.2-2L", sample_size: 800 },
  "IT:Mumbai:10": { median_band: "1.2-2L", sample_size: 600 },

  "IT:Hyderabad:2": { median_band: "30-50K", sample_size: 800 },
  "IT:Hyderabad:3": { median_band: "50-75K", sample_size: 900 },
  "IT:Hyderabad:5": { median_band: "75K-1.2L", sample_size: 1100 },
  "IT:Hyderabad:7": { median_band: "1.2-2L", sample_size: 700 },

  "IT:Pune:2": { median_band: "30-50K", sample_size: 700 },
  "IT:Pune:3": { median_band: "30-50K", sample_size: 800 },
  "IT:Pune:5": { median_band: "50-75K", sample_size: 1000 },
  "IT:Pune:7": { median_band: "75K-1.2L", sample_size: 600 },

  "IT:Delhi:2": { median_band: "30-50K", sample_size: 600 },
  "IT:Delhi:3": { median_band: "50-75K", sample_size: 700 },
  "IT:Delhi:5": { median_band: "75K-1.2L", sample_size: 900 },
  "IT:Delhi:7": { median_band: "1.2-2L", sample_size: 500 },

  "Finance:Mumbai:3": { median_band: "50-75K", sample_size: 600 },
  "Finance:Mumbai:5": { median_band: "75K-1.2L", sample_size: 500 },
  "Finance:Mumbai:7": { median_band: "1.2-2L", sample_size: 400 },
  "Finance:Mumbai:10": { median_band: "2L+", sample_size: 300 },

  "Finance:Bengaluru:3": { median_band: "50-75K", sample_size: 400 },
  "Finance:Bengaluru:5": { median_band: "75K-1.2L", sample_size: 350 },

  "Consulting:Mumbai:3": { median_band: "75K-1.2L", sample_size: 300 },
  "Consulting:Mumbai:5": { median_band: "1.2-2L", sample_size: 250 },
  "Consulting:Bengaluru:3": { median_band: "50-75K", sample_size: 200 },
  "Consulting:Bengaluru:5": { median_band: "1.2-2L", sample_size: 180 },

  "Healthcare:Mumbai:3": { median_band: "30-50K", sample_size: 300 },
  "Healthcare:Mumbai:5": { median_band: "50-75K", sample_size: 250 },
  "Healthcare:Bengaluru:3": { median_band: "30-50K", sample_size: 200 },

  "E-commerce:Bengaluru:3": { median_band: "50-75K", sample_size: 500 },
  "E-commerce:Bengaluru:5": { median_band: "75K-1.2L", sample_size: 400 },
  "E-commerce:Mumbai:3": { median_band: "50-75K", sample_size: 350 },

  "Manufacturing:Pune:3": { median_band: "30-50K", sample_size: 400 },
  "Manufacturing:Pune:5": { median_band: "50-75K", sample_size: 300 },
  "Manufacturing:Chennai:3": { median_band: "30-50K", sample_size: 350 },

  "Government:Delhi:5": { median_band: "50-75K", sample_size: 500 },
  "Government:Delhi:10": { median_band: "75K-1.2L", sample_size: 400 },
};
