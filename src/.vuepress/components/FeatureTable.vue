<template>
<div class="features">
	<div class="feature">
		<h3>Immutable</h3>
		<p>Data is never overwritten. See the history of data updates.</p>
		<img src="https://codenotary.io/images/jumpstart/immutable.svg"/>
	</div>
	<div class="feature">
			<h3>Auditable</h3>
			<p>Tamper-evident history system ensures data authenticity.</p>
			<img src="https://codenotary.io/images/jumpstart/auditable.svg"/>
	</div>
	<div class="feature">
			<h3>Secure</h3>
			<p>Data ownership is verifiable by clients and auditors.</p>
			<img src="https://codenotary.io/images/jumpstart/secure.svg"/>
	</div>
</div>
</template>

<style lang="scss">

.features {
	display: flex;
	flex-flow: row wrap;
}
.feature {
	flex-basis: 25ch;
	flex-grow: 1;
	display: flex;
	flex-flow: column;
	align-items: center;
	h3 {text-align: center;}
	p {text-align: center;}
	img {
		width: 80px;
	}
}

</style>