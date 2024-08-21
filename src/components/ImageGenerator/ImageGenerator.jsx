import './ImageGenerator.css';
import default_image from '../../assets/default_image.svg';
import { useState, useRef } from 'react';

const ImageGenerator = () => {
    // Managing the state of the generated image URL
    const [imageUrl, setImageUrl] = useState(default_image);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Referencing the input field
    let inputRef = useRef(null);

    const imageGenerator = async () => {
        const prompt = inputRef.current.value.trim();

        // If the input field is empty, return early
        if (prompt === "") {
            setError("Please enter a description to generate an image.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            // Fetch the image from OpenAI API
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer YOUR_OPENAI_API_KEY", // Replace with your actual API key
                },
                body: JSON.stringify({
                    prompt: prompt, // Gets the input from the input field
                    n: 1, // Generates only one image
                    size: "1024x1024", // Generated image size
                }),
            });

            // Check if response is not OK
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.error.message}`);
            }

            // Parsing the response
            const data = await response.json();

            // If image generation is successful, update the imageUrl state
            if (data && data.data && data.data.length > 0) {
                setImageUrl(data.data[0].url);
            } else {
                throw new Error("No image returned. Please try a different prompt.");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-image-generator">
            <div className="header">
                AI Image <span>Generator</span>
            </div>

            <div className="img-loading">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="image">
                        <img src={imageUrl} alt="Generated" />
                    </div>
                )}
            </div>

            <div className="search-box">
                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder="Describe what you want to see"
                />
                <div className="generate-btn" onClick={imageGenerator}>
                    Generate
                </div>
            </div>

            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default ImageGenerator;
