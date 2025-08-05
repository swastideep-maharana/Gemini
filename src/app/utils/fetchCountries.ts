export async function fetchCountries() {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.sort((a: any, b: any) =>
      a.name.common.localeCompare(b.name.common)
    );
  } catch (error) {
    console.error("Failed to fetch countries:", error);

    // Return fallback data with common countries
    return [
      {
        name: { common: "United States" },
        cca2: "US",
        idd: { root: "+1", suffixes: [""] },
      },
      {
        name: { common: "United Kingdom" },
        cca2: "GB",
        idd: { root: "+44", suffixes: [""] },
      },
      {
        name: { common: "India" },
        cca2: "IN",
        idd: { root: "+91", suffixes: [""] },
      },
      {
        name: { common: "Canada" },
        cca2: "CA",
        idd: { root: "+1", suffixes: [""] },
      },
      {
        name: { common: "Australia" },
        cca2: "AU",
        idd: { root: "+61", suffixes: [""] },
      },
      {
        name: { common: "Germany" },
        cca2: "DE",
        idd: { root: "+49", suffixes: [""] },
      },
      {
        name: { common: "France" },
        cca2: "FR",
        idd: { root: "+33", suffixes: [""] },
      },
      {
        name: { common: "Japan" },
        cca2: "JP",
        idd: { root: "+81", suffixes: [""] },
      },
      {
        name: { common: "China" },
        cca2: "CN",
        idd: { root: "+86", suffixes: [""] },
      },
      {
        name: { common: "Brazil" },
        cca2: "BR",
        idd: { root: "+55", suffixes: [""] },
      },
    ];
  }
}
