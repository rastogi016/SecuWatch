from cti_lookup import CTIlookup

lookup = CTIlookup()

result = lookup.lookup_ip("45.33.32.156")  # Malicious IP
print(result)

# SHA-256 for EICAR test virus (safe dummy malware file)
eicar_hash = "275a021bbfb6487e0e3440f4f1e321e7db198b789cbc1da41b6e7b4b62b3b98e"
result = lookup.lookup_hash(eicar_hash)
print(result)

url_result = lookup.lookup_url("http://www.eicar.org/download/eicar.com")
print(url_result)
