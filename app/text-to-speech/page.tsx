import Image from "next/image";

export default function Home() {
    return (
    <>
        <h2 className="border-bottom p-3 fs-5">Text to Speech</h2>

        {/* 文本输入框 */}
        <div className="m-4">
            <textarea
            id="textInput"
            className="form-control"
            rows={10}
            placeholder="Start typing here or paste any text you want to turn into lifelike speech..."
            ></textarea>
        </div>

        {/* 生成按钮 */}
        <div className="d-flex">
            <button className="btn btn-primary mt-3 me-4 ms-auto">Generate speech</button>
        </div>
    </>
    
    );
}