#!/bin/bash
# Quick seed via Payload REST API. Requires dev server running.
set -e
BASE="http://localhost:3000/api"
CT="Content-Type: application/json"

echo "🔐 Logging in..."
TOKEN=$(curl -s -X POST "$BASE/users/login" -H "$CT" \
  -d '{"email":"admin@jskindia.in","password":"admin123"}' | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))")

if [ -z "$TOKEN" ]; then echo "❌ Login failed"; exit 1; fi
AUTH="Authorization: Bearer $TOKEN"
echo "✅ Logged in"

post() {
  local col=$1 data=$2
  curl -s -X POST "$BASE/$col" -H "$CT" -H "$AUTH" -d "$data" | python3 -c "
import sys,json
d=json.load(sys.stdin)
doc=d.get('doc',{})
print(f'  ✅ {doc.get(\"name\",doc.get(\"title\",doc.get(\"slug\",\"?\")))}')
" 2>/dev/null || echo "  ⚠️  failed"
}

echo ""
echo "📁 Seeding product categories..."
for row in \
  '{"name":"Conductors","slug":"conductors","order":1}' \
  '{"name":"Wire Rods","slug":"wire-rods","order":2}' \
  '{"name":"Wires","slug":"wires","order":3}' \
  '{"name":"Trading","slug":"trading","order":4}'; do
  post "product-categories" "$row"
done

echo ""
echo "👥 Seeding leadership..."
post "persons" '{"name":"Mr. Dinesh Shah","role":"Founder","isFounder":true,"isBoard":false,"order":0}'
post "persons" '{"name":"Mr. Kalpesh D. Shah","role":"Director","isFounder":false,"isBoard":true,"order":1,"qualifications":"MBA from USA, BE Mechanical from India."}'
post "persons" '{"name":"Mr. Anish D. Shah","role":"Director","isFounder":false,"isBoard":true,"order":2,"qualifications":"Chartered Accountant. 12+ years in finance, audit & legal."}'

echo ""
echo "🏭 Seeding verticals..."
post "verticals" '{"name":"VEDA","slug":"veda","summary":"Vibrational Effects Detection Analysis — a novel photonic system for real-time railway track monitoring, blockade detection, and rolling stock monitoring.","_status":"published"}'
post "verticals" '{"name":"Digital Substation","slug":"digital-substation","summary":"ARIS MD/MC substation automation solutions per IEC 61850, developed in partnership with Prosoft-Systems.","_status":"published"}'
post "verticals" '{"name":"Cyber Security","slug":"cyber-security","summary":"Velox UDA — OT/IT convergence solution enabling utility companies to access operational data remotely.","_status":"published"}'

echo ""
echo "🏆 Seeding certifications..."
post "certifications" '{"name":"ISO 9001","issuer":"Bureau of Indian Standards"}'

echo ""
echo "📄 Seeding investor documents..."
post "investor-documents" '{"title":"Annual Return - FY 2021-22","category":"annual_return","fy":"FY 2021-22","publishedAt":"2022-09-30"}'
post "investor-documents" '{"title":"Annual Return - FY 2020-21","category":"annual_return","fy":"FY 2020-21","publishedAt":"2021-09-30"}'

echo ""
echo "🏢 Seeding manufacturing plants..."
post "plants" '{"name":"Sayli Works","slug":"sayli","address":"Survey No. 369/1/1/2, Behind Siyaram Silk Mills Limited, Village Sayli","city":"Silvassa","area":"35,000 sq. meter"}'
post "plants" '{"name":"Rakholi Works","slug":"rakholi","address":"Survey No. 126/1-B, Near Rakholi School, Rakholi","city":"Silvassa"}'

echo ""
echo "🤝 Seeding top clients (first 15)..."
for client in \
  "Power Grid Corporation of India Ltd. (PGCIL)" \
  "Larsen & Toubro Ltd. (L&T)" \
  "Bharat Heavy Electricals Ltd. (BHEL)" \
  "Reliance Industries Ltd. (RIL)" \
  "Steel Authority of India Ltd. (SAIL)" \
  "Tata Iron & Steel Co. (TISCO)" \
  "Suzlon Energy Ltd." \
  "Kalpataru Power Transmission Ltd. (KPTL)" \
  "ABB Ltd." \
  "Gujarat Energy Transmission Corporation Ltd. (GETCO)" \
  "Torrent Power Ltd." \
  "Apar Industries Ltd." \
  "Sterlite Industries (India) Ltd." \
  "Finolex Cables Ltd." \
  "Polycab Wires Ltd."; do
  featured="false"
  for f in PGCIL L\&T BHEL RIL SAIL TISCO Suzlon KPTL; do
    if echo "$client" | grep -q "$f"; then featured="true"; break; fi
  done
  post "clients" "{\"name\":\"$client\",\"isFeatured\":$featured}"
done

echo ""
echo "📦 Seeding products (conductors)..."
for row in \
  '{"name":"All Aluminium Alloy Conductor","code":"AAAC","slug":"aaac","shortDescription":"High-strength, corrosion-resistant conductor for overhead transmission and distribution lines.","_status":"published"}' \
  '{"name":"All Aluminium Conductor","code":"AAC","slug":"aac","shortDescription":"EC grade aluminium concentric-lay-stranded conductor for power distribution.","_status":"published"}' \
  '{"name":"Aluminium Conductor, Steel Reinforced","code":"ACSR","slug":"acsr","shortDescription":"High-strength conductor with steel core for long-span power transmission.","_status":"published"}' \
  '{"name":"Aluminium Alloy Conductor, Steel Reinforced","code":"AACSR","slug":"aacsr","shortDescription":"Aluminium alloy wires with steel core for enhanced mechanical properties.","_status":"published"}' \
  '{"name":"Aluminium Conductor Alloy Reinforced","code":"ACAR","slug":"acar","shortDescription":"Aluminium 1350 and alloy strands for good conductivity and strength.","_status":"published"}' \
  '{"name":"ACSR Aluminium-Clad Steel Reinforced","code":"ACSR/AW","slug":"acsr-aw","shortDescription":"ACSR with aluminium-clad steel core for improved corrosion resistance.","_status":"published"}' \
  '{"name":"ACSR Trapezoidal Wire","code":"ACSR/TW","slug":"acsr-tw","shortDescription":"Trapezoidal shaped aluminium strands for compact design and increased ampacity.","_status":"published"}'; do
  post "products" "$row"
done

echo ""
echo "🎉 Seed complete! Open http://localhost:3000/admin to see the data."
