import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models import *

def init_pmis_opportunities():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if already initialized
        if db.query(Internship).count() > 0:
            print("PMIS partner opportunities already present in database.")
            return

        partners = [
            {
                "email": "partnerships@tatamotors.com",
                "name": "Tata Motors Ltd",
                "industry": "Automotive & Manufacturing",
                "city": "Pune",
                "state": "Maharashtra",
                "desc": "Official PMIS Enterprise Partner. India's leading automobile manufacturer specializing in passenger vehicles, commercial trucks, and Electric Vehicles (EVs).",
                "logo": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg",
                "internships": [
                    {
                        "title": "Embedded Systems & Electric Vehicle (EV) Intern",
                        "desc": "Work directly with the EV Powertrain & Battery Management Systems (BMS) telemetry division. Tasks include firmware optimization, CAN bus protocol testing, and microcontroller interfacing.",
                        "skills": ["Embedded Systems", "C++", "IoT", "Python", "MATLAB/Simulink"],
                        "edu": "B.Tech / B.E.",
                        "min_cgpa": 6.5,
                        "locations": ["Pune", "Bengaluru", "Remote"],
                        "vacancies": 6,
                        "stipend": 16000.0,
                        "duration": 6,
                        "responsibilities": [
                            "Develop and test firmware drivers for battery management systems (BMS) in C++",
                            "Implement CAN-bus and LIN communication protocols for vehicle telematics",
                            "Run hardware-in-the-loop (HIL) simulation tests using MATLAB and Simulink",
                            "Document safety compliance and debugging logs under automotive standards (ISO 26262)"
                        ],
                        "benefits": [
                            "₹16,000 / month direct bank stipend under PMIS",
                            "Official Government of India PMIS Completion Certificate",
                            "1-on-1 mentorship with Tata Motors EV Powertrain Chief Engineers",
                            "Eligibility for full-time Graduate Engineer Trainee (GET) Pre-Placement Offer",
                            "Remote work flexibility with testing hardware kit provided"
                        ]
                    },
                    {
                        "title": "Smart Manufacturing Automation & CAD Intern",
                        "desc": "Participate in Industry 4.0 plant automation, digital twin modeling, robotic assembly line simulation, and process quality engineering.",
                        "skills": ["AutoCAD", "SolidWorks", "Python", "PLC"],
                        "edu": "Diploma / B.Tech",
                        "min_cgpa": 6.0,
                        "locations": ["Pune", "Sanand"],
                        "vacancies": 4,
                        "stipend": 13000.0,
                        "duration": 6,
                        "responsibilities": [
                            "Design 3D mechanical components and sheet metal tooling using SolidWorks & AutoCAD",
                            "Assist in robotic welding cell automation and PLC ladder logic programming",
                            "Implement digital twin monitoring for production line cycle time reduction",
                            "Perform quality audit inspections and root cause failure analysis (RCFA)"
                        ],
                        "benefits": [
                            "₹13,000 / month stipend with subsidized plant meals and transport",
                            "Certified Industry 4.0 hands-on training credential",
                            "Practical factory floor exposure at Tata Motors' Pune/Sanand plant",
                            "Direct consideration for Junior Engineer Trainee roles"
                        ]
                    }
                ]
            },
            {
                "email": "pmis-recruitment@infosys.com",
                "name": "Infosys Technologies",
                "industry": "IT & Software",
                "city": "Bengaluru",
                "state": "Karnataka",
                "desc": "Global digital services and enterprise transformation partner accredited under the Prime Minister's Internship Scheme.",
                "logo": "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
                "internships": [
                    {
                        "title": "Full Stack Cloud Application Intern",
                        "desc": "Hands-on engineering in enterprise cloud platforms. Build RESTful APIs, modern reactive user interfaces with React and Tailwind, and integrate PostgreSQL databases on AWS.",
                        "skills": ["Python", "React", "SQL", "FastAPI", "Docker", "Git"],
                        "edu": "Bachelor's / B.Tech / BCA",
                        "min_cgpa": 6.5,
                        "locations": ["Bengaluru", "Hyderabad", "Remote"],
                        "vacancies": 8,
                        "stipend": 18000.0,
                        "duration": 6,
                        "responsibilities": [
                            "Build responsive, accessible frontend modules using React 18 and Tailwind CSS",
                            "Develop high-performance RESTful API microservices in Python (FastAPI/Django)",
                            "Design optimized PostgreSQL schemas, indexes, and automated data migrations",
                            "Containerize application services with Docker and configure CI/CD deployment pipelines",
                            "Participate in agile sprint ceremonies, code reviews, and architectural discussions"
                        ],
                        "benefits": [
                            "₹18,000 / month direct stipend accredited by PMIS",
                            "Infosys Certified Full Stack Cloud Developer credential",
                            "Fast-track interview for Systems Engineer Specialist (SES) positions",
                            "100% Remote / Hybrid flexibility with company cloud laptop allowance",
                            "Access to Infosys Springboard premium enterprise learning library"
                        ]
                    },
                    {
                        "title": "Data Engineering & Business Intelligence Intern",
                        "desc": "Transform high-volume datasets, build analytics pipelines using Pandas and SQL, and generate executive KPI dashboards in Power BI.",
                        "skills": ["Python", "Pandas", "SQL", "Power BI", "Data Analysis"],
                        "edu": "Bachelor's Degree",
                        "min_cgpa": 6.0,
                        "locations": ["Bengaluru", "Remote"],
                        "vacancies": 5,
                        "stipend": 17000.0,
                        "duration": 6,
                        "responsibilities": [
                            "Design automated ETL pipelines extracting telemetry and transactional data into PostgreSQL",
                            "Clean, normalize, and validate multi-million row datasets using Python Pandas and NumPy",
                            "Develop interactive Power BI and Tableau dashboards tracking executive KPIs",
                            "Write optimized SQL analytical queries and window functions for reporting"
                        ],
                        "benefits": [
                            "₹17,000 / month direct stipend under PMIS",
                            "Infosys Big Data & Business Analytics Certification",
                            "PPO opportunity for Associate Data Engineer roles",
                            "Work from anywhere with remote cloud infrastructure access",
                            "Mentorship from Principal Big Data Architects"
                        ]
                    }
                ]
            },
            {
                "email": "careers@larsentoubro.com",
                "name": "Larsen & Toubro (L&T)",
                "industry": "Infrastructure & Heavy Engineering",
                "city": "Mumbai",
                "state": "Maharashtra",
                "desc": "Leading multinational conglomerate engaged in EPC projects, high-tech manufacturing, smart cities, and digital engineering.",
                "logo": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Larsen%26Toubro_logo.svg",
                "internships": [
                    {
                        "title": "Smart Cities IoT & SCADA Automation Engineer",
                        "desc": "Deploy IoT telemetry systems, smart grid sensor interfaces, and automated environmental monitoring systems for national infrastructure projects.",
                        "skills": ["IoT", "PLC", "Python", "Linux", "AutoCAD"],
                        "edu": "Diploma / B.Tech",
                        "min_cgpa": 6.0,
                        "locations": ["Mumbai", "Chennai", "Delhi-NCR"],
                        "vacancies": 5,
                        "stipend": 16500.0,
                        "duration": 6,
                        "responsibilities": [
                            "Configure SCADA telemetry systems for urban water, power, and traffic infrastructure",
                            "Interface industrial IoT sensors with PLC microcontrollers over Modbus and MQTT",
                            "Develop real-time monitoring scripts in Python on embedded Linux gateways",
                            "Conduct site reliability tests, hardware diagnostics, and commissioning reports"
                        ],
                        "benefits": [
                            "₹16,500 / month stipend with travel allowances on site visits",
                            "L&T Smart Infrastructure Engineering Certificate",
                            "Priority placement for L&T Build India Graduate Trainees",
                            "Experience on landmark national urban infrastructure projects"
                        ]
                    }
                ]
            },
            {
                "email": "talent@hcltech.com",
                "name": "HCLTech",
                "industry": "IT & Software",
                "city": "Noida",
                "state": "Uttar Pradesh",
                "desc": "Global technology company delivering industry-leading solutions in digital, engineering, and cybersecurity.",
                "internships": [
                    {
                        "title": "Cybersecurity Operations & Linux Systems Intern",
                        "desc": "Monitor enterprise network perimeters, detect security vulnerabilities, automate incident response playbooks with Python, and manage hardened Linux systems.",
                        "skills": ["Linux", "Python", "Git", "SQL"],
                        "edu": "BCA / B.Sc / B.Tech",
                        "min_cgpa": 6.0,
                        "locations": ["Noida", "Lucknow", "Remote"],
                        "vacancies": 4,
                        "stipend": 15000.0,
                        "duration": 6,
                        "responsibilities": [
                            "Monitor Security Information and Event Management (SIEM) consoles for perimeter alerts",
                            "Perform network vulnerability scanning and patch management on hardened Linux hosts",
                            "Automate threat intelligence gathering and log parsing scripts in Python",
                            "Participate in simulated incident response drills and triage documentation"
                        ],
                        "benefits": [
                            "₹15,000 / month stipend under PMIS",
                            "HCLTech Certified SOC Analyst badge",
                            "Direct evaluation for Entry-Level Cybersecurity Analyst vacancies",
                            "Flexible remote schedule with cloud lab environments provided",
                            "Industry standard defense training (MITRE ATT&CK framework)"
                        ]
                    }
                ]
            },
            {
                "email": "campus@mahindra.com",
                "name": "Mahindra & Mahindra",
                "industry": "Automotive & Manufacturing",
                "city": "Chennai",
                "state": "Tamil Nadu",
                "desc": "Indian multinational automotive pioneer known for tractors, utility vehicles, and defense technology.",
                "internships": [
                    {
                        "title": "Automotive Vehicle Dynamics & CAD Intern",
                        "desc": "Collaborate on vehicle chassis design, structural FEA analysis, crash safety benchmarking, and component 3D modeling using SolidWorks.",
                        "skills": ["SolidWorks", "AutoCAD", "Mechanical Engineering", "Python"],
                        "edu": "B.Tech / Diploma",
                        "min_cgpa": 6.5,
                        "locations": ["Chennai", "Pune"],
                        "vacancies": 4,
                        "stipend": 15000.0,
                        "duration": 4,
                        "responsibilities": [
                            "Perform 3D CAD modeling and kinematic assembly simulations using SolidWorks",
                            "Analyze suspension geometry and chassis stress distribution using FEA tools",
                            "Process track telemetry sensor data using Python to benchmark ride quality",
                            "Prepare technical engineering documentation and bill of materials (BOM)"
                        ],
                        "benefits": [
                            "₹15,000 / month stipend",
                            "Mahindra Automotive R&D experience certificate",
                            "Hands-on access to test tracks and vehicle dynamics testing rigs",
                            "PPO potential for Mahindra RISE Graduate Engineer Trainees"
                        ]
                    }
                ]
            }
        ]

        for p in partners:
            user = User(
                email=p["email"],
                hashed_password=get_password_hash("PartnerCorporate@2026"),
                role="COMPANY"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            company = CompanyProfile(
                user_id=user.id,
                company_name=p["name"],
                industry=p["industry"],
                website=f"https://www.{p['name'].lower().replace(' ', '')}.com",
                location_city=p["city"],
                location_state=p["state"],
                description=p["desc"],
                logo_url=p.get("logo"),
                is_verified=True
            )
            db.add(company)
            db.commit()
            db.refresh(company)

            for i_data in p["internships"]:
                internship = Internship(
                    company_id=company.id,
                    title=i_data["title"],
                    description=i_data["desc"],
                    required_skills=i_data["skills"],
                    min_education_level=i_data["edu"],
                    preferred_locations=i_data["locations"],
                    industry=p["industry"],
                    min_cgpa=i_data.get("min_cgpa", 6.0),
                    vacancies=i_data["vacancies"],
                    stipend_amount=i_data["stipend"],
                    duration_months=i_data["duration"],
                    responsibilities=i_data.get("responsibilities"),
                    benefits=i_data.get("benefits"),
                    status="OPEN"
                )
                db.add(internship)
            db.commit()

        print(f"Successfully initialized {len(partners)} verified PMIS enterprise partners and their active internship opportunities.")
    except Exception as e:
        print(f"Error initializing partner opportunities: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_pmis_opportunities()
