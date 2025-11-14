#!/bin/bash

# Load Test: Create 20 test contacts
SERVICE_URL="https://investor-match-ai-contact-service-23715448976.us-central1.run.app"

echo "Starting load test: Creating 20 contacts..."

for i in {1..20}; do
  echo "Creating contact $i..."
  
  curl -X POST $SERVICE_URL/contacts \
    -H "Content-Type: application/json" \
    -d "{
      \"full_name\": \"Test User $i\",
      \"headline\": \"Engineer $i\",
      \"contact_type\": \"$([ $((i % 2)) -eq 0 ] && echo 'founder' || echo 'investor')\",
      \"location_city\": \"City $i\",
      \"location_country\": \"USA\",
      \"job_to_be_done\": [\"build_product\", \"raise_funding\"],
      \"skills\": [\"javascript\", \"python\", \"skill_$i\"],
      \"industries\": [\"fintech\", \"industry_$i\"],
      \"verticals\": [\"b2b\"],
      \"product_types\": [\"saas\"],
      \"funding_stages\": [\"seed\", \"series_a\"],
      \"company_headcount_ranges\": [\"1-10\"],
      \"engineering_headcount_ranges\": [\"1-5\"],
      \"target_domains\": [\"enterprise\"],
      \"roles\": [\"engineer\", \"ceo\"],
      \"experiences\": [],
      \"current_company\": \"Company $i\",
      \"current_role\": \"Role $i\",
      \"past_companies\": [],
      \"seniority_levels\": [\"senior\"],
      \"founder_roles\": [\"ceo\"],
      \"investor_roles\": [],
      \"stage_preferences\": [],
      \"check_size_range\": [],
      \"team_size_preferences\": [],
      \"founder_seniority_preferences\": [],
      \"engineering_headcount_preferences\": [],
      \"revenue_model_preferences\": [],
      \"risk_tolerance_preferences\": [],
      \"linkedin_url\": null,
      \"email\": \"test$i@example.com\"
    }" \
    -w "\nStatus: %{http_code} | Time: %{time_total}s\n" \
    -s -o /dev/null
    
  sleep 0.5  # Small delay between requests
done

echo "Load test completed! Created 20 contacts."
echo "Check Firestore for:"
echo "- 20 contacts in contacts collection"
echo "- Shared skills (javascript, python) should have 20 contact IDs"
echo "- Unique skills (skill_1, skill_2, etc.) should have 1 contact ID each"
