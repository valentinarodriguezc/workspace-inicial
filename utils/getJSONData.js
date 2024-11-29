async function getJSONData(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return { status: "ok", data };
        } else {
            console.error(`Error al obtener datos: ${response.status}`);
            return { status: "error", data: null };
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        return { status: "error", data: null };
    }
}
