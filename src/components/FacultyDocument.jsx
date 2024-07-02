import React from 'react';

const DocumentForm = () => {
  return (
    <form>
      <div>
        <label htmlFor="title">제목:</label>
        <input type="text" id="title" name="title" />
      </div>
      <div>
        <label htmlFor="content">내용:</label>
        <textarea id="content" name="content"></textarea>
      </div>
      <button type="submit">저장</button>
    </form>
  );
};

export default DocumentForm;
